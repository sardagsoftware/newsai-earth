import os, math
from typing import List, Tuple
from tqdm import tqdm
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip

INPUT_DIR   = "input"
IMAGES_DIR  = os.path.join(INPUT_DIR, "images")
AUDIO_FILE  = os.path.join(INPUT_DIR, "song.wav")   # MP3 de olur
SCENARIO    = os.path.join(INPUT_DIR, "scenario.txt")
OUTPUT_DIR  = "output"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "final.mp4")

TARGET_FPS        = 30
TARGET_W, TARGET_H= 1920, 1080
CROSSFADE_SEC     = 1.0
TARGET_SECS       = 213  # 3:33

def parse_line(line:str)->Tuple[int,str,str,str]:
    parts = [p.strip() for p in line.split("|")]
    dur = int(parts[0]); img = os.path.join(IMAGES_DIR, parts[1])
    eff = parts[2].lower(); trn = parts[3].lower() if len(parts)>=4 else "crossfade"
    return dur, img, eff, trn

def parse_scenario(path:str)->List[Tuple[int,str,str,str]]:
    scenes=[]
    with open(path,"r",encoding="utf-8") as f:
        for ln in f:
            s=ln.strip()
            if not s or s.startswith("#"): continue
            scenes.append(parse_line(s))
    if not scenes: raise RuntimeError("scenario.txt boş")
    return scenes

def ensure_size(clip:ImageClip)->ImageClip:
    # Letterbox: 1920x1080 çerçeve
    return clip.resize(width=TARGET_W).on_color(size=(TARGET_W,TARGET_H), color=(0,0,0), pos=("center","center"))

def apply_effect(clip:ImageClip, eff:str)->ImageClip:
    if eff=="zoom":         return clip.resize(lambda t:1+0.05*t)
    if eff=="pan-left":     return clip.set_position(lambda t:(-40*t,0))
    if eff=="pan-right":    return clip.set_position(lambda t:(40*t,0))
    if eff=="pan-up":       return clip.set_position(lambda t:(0,-30*t))
    if eff=="pan-down":     return clip.set_position(lambda t:(0,30*t))
    if eff=="fade":         return clip.crossfadein(1)
    if eff=="subtle-kenburns": return clip.resize(lambda t:1.03+0.02*math.sin(t))
    return clip

def build_clips(scenes):
    clips=[]
    for dur,img,eff,trn in tqdm(scenes,desc="Sahneler"):
        if not os.path.exists(img):
            print(f"⚠️  Görsel yok: {img} (atlanıyor)")
            continue
        base=ImageClip(img,duration=dur); base=ensure_size(base); fx=apply_effect(base,eff)
        comp=CompositeVideoClip([fx],size=(TARGET_W,TARGET_H)).set_duration(dur)
        if trn!="none": comp=comp.crossfadein(CROSSFADE_SEC)
        clips.append(comp)
    if not clips: raise RuntimeError("Hiç klip oluşmadı")
    return clips

def chain_with_crossfade(clips):
    out=clips[0]
    for c in clips[1:]:
        out=concatenate_videoclips([out,c], method="compose", padding=-CROSSFADE_SEC)
    return out

def trim_or_pad(video, audio_dur):
    if video.duration>audio_dur:
        return video.subclip(0,audio_dur)
    gap = audio_dur - video.duration
    if gap>0.05:
        tail=ImageClip(video.get_frame(video.duration-1e-2), duration=gap)
        tail=ensure_size(tail)
        video=concatenate_videoclips([video,tail])
    return video

def main():
    if not os.path.exists(AUDIO_FILE):
        raise FileNotFoundError("input/song.wav bulunamadı (WAV/MP3 koy)")
    scenes=parse_scenario(SCENARIO)
    clips=build_clips(scenes)
    video=chain_with_crossfade(clips)

    audio=AudioFileClip(AUDIO_FILE)
    target=min(audio.duration, TARGET_SECS)
    video=trim_or_pad(video, target).set_audio(audio.subclip(0,target))

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    video.write_videofile(OUTPUT_FILE, fps=TARGET_FPS, codec="libx264", audio_codec="aac", threads=4, preset="medium")
    print(f"✅ Tamam: {OUTPUT_FILE} (≈ {video.duration:.1f}s)")

if __name__=="__main__":
    main()
