from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np, math, random, os
random.seed(240926)
root=os.path.join(os.path.dirname(__file__),'assets')
icons=os.path.join(root,'icons'); textures=os.path.join(root,'textures')
os.makedirs(icons,exist_ok=True); os.makedirs(textures,exist_ok=True)
def rgba(s=(1024,1024)): return Image.new('RGBA',s,(0,0,0,0))
def save_svg(name,body,w=1024,h=1024):
    open(os.path.join(icons,name),'w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>')
def star(cx,cy,rx,ry): return [(cx,cy-ry),(cx+rx*.18,cy-ry*.18),(cx+rx,cy),(cx+rx*.18,cy+ry*.18),(cx,cy+ry),(cx-rx*.18,cy+ry*.18),(cx-rx,cy),(cx-rx*.18,cy-ry*.18)]
def quant(f,colors=48):
    im=Image.open(f).convert('RGBA')
    im.quantize(colors=colors,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).save(f,optimize=True,compress_level=9)

# 1 四芒星の連続装飾
im=rgba(); d=ImageDraw.Draw(im)
for i,x in enumerate([190,350,512,674,834]):
    s=[82,56,102,60,84][i]
    d.line((x-116,512,x+116,512),fill=(255,255,255,80),width=2)
    d.polygon(star(x,512,s*.33,s),outline=(255,255,255,255))
    d.ellipse((x-7,505,x+7,519),fill=(191,255,43,255))
for x in range(108,920,32): d.ellipse((x,454,x+4,458),fill=(255,255,255,150))
f=os.path.join(icons,'star-chain-tech-01.png'); im.save(f); quant(f,24)
svg=''.join([f'<path d="M {x} {512-s} L {x+s*.18} {512-s*.18} L {x+s*.33} 512 L {x+s*.18} {512+s*.18} L {x} {512+s} L {x-s*.18} {512+s*.18} L {x-s*.33} 512 L {x-s*.18} {512-s*.18} Z" fill="none" stroke="white" stroke-width="3"/>' for x,s in zip([190,350,512,674,834],[82,56,102,60,84])]); save_svg('star-chain-tech-01.svg',svg)

# 2 ワイヤーフレーム球体
im=rgba(); d=ImageDraw.Draw(im); cx=cy=512; R=300
for k in [-60,-30,0,30,60]:
    ry=R*math.cos(math.radians(k)); y=cy+R*math.sin(math.radians(k))*.55
    d.ellipse((cx-R,y-ry*.26,cx+R,y+ry*.26),outline=(255,255,255,210),width=2)
for a in [-70,-45,-20,0,20,45,70]:
    w=max(20,R*2*abs(math.cos(math.radians(a))))
    d.ellipse((cx-w/2,cy-R,cx+w/2,cy+R),outline=(255,255,255,190),width=2)
d.ellipse((cx-R,cy-R,cx+R,cy+R),outline=(255,255,255,255),width=3)
orb=rgba(); od=ImageDraw.Draw(orb); od.ellipse((135,435,889,589),outline=(191,255,43,255),width=4); orb=orb.rotate(-18,center=(512,512),resample=Image.Resampling.BICUBIC)
im=Image.alpha_composite(im,orb); f=os.path.join(icons,'wireframe-globe-tech-02.png'); im.save(f); quant(f,32)
svg='<circle cx="512" cy="512" r="300" fill="none" stroke="white" stroke-width="3"/>'
for k in [-60,-30,0,30,60]:
    ry=R*math.cos(math.radians(k)); y=cy+R*math.sin(math.radians(k))*.55
    svg+=f'<ellipse cx="512" cy="{y:.1f}" rx="300" ry="{ry*.26:.1f}" fill="none" stroke="white" stroke-width="2" opacity=".82"/>'
for a in [-70,-45,-20,0,20,45,70]:
    w=max(20,R*2*abs(math.cos(math.radians(a))))
    svg+=f'<ellipse cx="512" cy="512" rx="{w/2:.1f}" ry="300" fill="none" stroke="white" stroke-width="2" opacity=".75"/>'
svg+='<ellipse cx="512" cy="512" rx="380" ry="78" transform="rotate(-18 512 512)" fill="none" stroke="#bfff2b" stroke-width="4"/>'; save_svg('wireframe-globe-tech-02.svg',svg)

# 3 歪んだメッシュ
im=rgba(); d=ImageDraw.Draw(im)
for j in range(17):
    pts=[]
    for i in range(85):
        x=120+i*9.3+18*math.sin(j*.6+i/15); y=190+j*40+42*math.sin(i/9+j*.55)+18*math.sin(i/3.7+j*.2); pts.append((x,y))
    d.line(pts,fill=(255,255,255,160),width=2)
for i in range(22):
    pts=[]
    for j in range(70):
        y=170+j*10; x=145+i*34+32*math.sin(j/7+i*.55)+12*math.sin(j/2.9+i); pts.append((x,y))
    d.line(pts,fill=(255,255,255,115),width=2)
f=os.path.join(icons,'warped-mesh-elastic-01.png'); im.save(f); quant(f,24)
svg=''
for j in range(17):
    pts=[]
    for i in range(85):
        x=120+i*9.3+18*math.sin(j*.6+i/15); y=190+j*40+42*math.sin(i/9+j*.55)+18*math.sin(i/3.7+j*.2); pts.append(f'{x:.1f},{y:.1f}')
    svg+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="white" stroke-width="2" opacity=".65"/>'
for i in range(22):
    pts=[]
    for j in range(70):
        y=170+j*10; x=145+i*34+32*math.sin(j/7+i*.55)+12*math.sin(j/2.9+i); pts.append(f'{x:.1f},{y:.1f}')
    svg+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="white" stroke-width="2" opacity=".45"/>'
save_svg('warped-mesh-elastic-01.svg',svg)

# 4 軌道リング
im=rgba()
for angle,box,width,color in [(-28,(170,395,854,629),5,(255,255,255,255)),(26,(240,335,784,689),3,(180,210,255,220)),(72,(345,245,679,779),3,(191,255,43,255))]:
    layer=rgba(); ImageDraw.Draw(layer).ellipse(box,outline=color,width=width); layer=layer.rotate(angle,center=(512,512),resample=Image.Resampling.BICUBIC); im=Image.alpha_composite(im,layer)
ImageDraw.Draw(im).ellipse((498,498,526,526),outline=(255,255,255,255),width=3)
f=os.path.join(icons,'orbit-ring-triple-01.png'); im.save(f); quant(f,32)
save_svg('orbit-ring-triple-01.svg','<ellipse cx="512" cy="512" rx="342" ry="117" transform="rotate(-28 512 512)" fill="none" stroke="white" stroke-width="5"/><ellipse cx="512" cy="512" rx="272" ry="177" transform="rotate(26 512 512)" fill="none" stroke="#b4d2ff" stroke-width="3"/><ellipse cx="512" cy="512" rx="167" ry="267" transform="rotate(72 512 512)" fill="none" stroke="#bfff2b" stroke-width="3"/><circle cx="512" cy="512" r="14" fill="none" stroke="white" stroke-width="3"/>')

# 5 テクニカル矢印
im=rgba(); d=ImageDraw.Draw(im)
d.line((140,512,820,512),fill=(255,255,255,255),width=8); d.line((140,486,140,538),fill=(255,255,255,255),width=3); d.polygon([(820,450),(930,512),(820,574)],outline=(255,255,255,255))
for x in [220,310,400,490,580,670,760]: d.line((x,494,x,530),fill=(191,255,43,220),width=3)
d.arc((90,420,250,580),220,140,fill=(255,255,255,150),width=2); d.ellipse((111,483,169,541),outline=(255,255,255,140),width=2)
f=os.path.join(icons,'technical-arrow-vector-01.png'); im.save(f); quant(f,24)
save_svg('technical-arrow-vector-01.svg','<line x1="140" y1="512" x2="820" y2="512" stroke="white" stroke-width="8"/><line x1="140" y1="486" x2="140" y2="538" stroke="white" stroke-width="3"/><path d="M820 450 L930 512 L820 574" fill="none" stroke="white" stroke-width="5"/>'+''.join([f'<line x1="{x}" y1="494" x2="{x}" y2="530" stroke="#bfff2b" stroke-width="3"/>' for x in [220,310,400,490,580,670,760]]))

# 6 チェッカー帯
im=rgba(); d=ImageDraw.Draw(im); x0,y0=90,382; cell=56
for r in range(4):
  for c in range(15):
    if (r+c)%2==0: d.rectangle((x0+c*cell,y0+r*cell,x0+(c+1)*cell,y0+(r+1)*cell),fill=(255,255,255,255))
im=im.transform(im.size,Image.Transform.AFFINE,(1,.24,-123,0,1,0),resample=Image.Resampling.BICUBIC)
f=os.path.join(icons,'checker-band-skew-01.png'); im.save(f); quant(f,16)
svg='<g transform="skewX(-14)">'+''.join([f'<rect x="{140+c*56}" y="{382+r*56}" width="56" height="56" fill="white"/>' for r in range(4) for c in range(15) if (r+c)%2==0])+'</g>'; save_svg('checker-band-skew-01.svg',svg)

# 7 クローム抽象
S=1024; Y,X=np.mgrid[0:S,0:S]; cx=cy=512; r=np.sqrt((X-cx)**2+(Y-cy)**2); th=np.arctan2(Y-cy,X-cx)
bound=260+75*np.sin(3*th+.8)+45*np.sin(5*th-.5); mask=(r<bound)&(r>95+28*np.sin(2*th)); mask &= ~(((X-512)**2+(Y-450)**2)<105**2)
v=.5+.5*np.sin(Y*.034+X*.010+1.1*np.sin(th*4)); chrome=np.clip(35+220*v,0,255)
arr=np.zeros((S,S,4),dtype=np.uint8); arr[...,0]=np.clip(chrome+22*np.sin(th*2),0,255); arr[...,1]=np.clip(chrome+10*np.sin(th*3),0,255); arr[...,2]=np.clip(chrome+34*np.cos(th*2),0,255); arr[...,3]=mask.astype(np.uint8)*255
f=os.path.join(icons,'chrome-liquid-knot-01.png'); Image.fromarray(arr,'RGBA').filter(ImageFilter.GaussianBlur(.35)).save(f); quant(f,32)

# 8 白黒コピー風の手
mask=Image.new('L',(S,S),0); md=ImageDraw.Draw(mask)
md.polygon([(390,760),(340,610),(365,455),(440,375),(560,390),(640,480),(635,620),(570,770)],fill=255)
def capsule(cx,cy,w,h,angle):
    layer=Image.new('L',(S,S),0); ld=ImageDraw.Draw(layer); x0=cx-w//2; y0=cy-h//2; ld.rounded_rectangle((x0,y0,x0+w,y0+h),radius=w//2,fill=255); return layer.rotate(angle,center=(cx,cy),resample=Image.Resampling.BICUBIC)
for p in [(420,335,74,300,-14),(492,300,72,330,-4),(560,316,70,300,7),(625,360,66,260,18),(332,515,72,230,-53)]: mask=ImageChops.lighter(mask,capsule(*p))
ImageDraw.Draw(mask).polygon([(390,745),(570,745),(620,930),(360,930)],fill=255)
rng=np.random.default_rng(83); noise=rng.random((S,S)); yy,xx=np.mgrid[0:S,0:S]; half=((xx%12<5)&(yy%12<5)).astype(float); val=np.clip(45+95*noise+75*half+75*np.exp(-(((xx-470)/240)**2+((yy-470)/340)**2)),0,255).astype(np.uint8)
tex=np.zeros((S,S,4),dtype=np.uint8); tex[...,:3]=val[...,None]; tex[...,3]=np.array(mask); hand=Image.fromarray(tex,'RGBA').rotate(-8,center=(512,560),resample=Image.Resampling.BICUBIC)
f=os.path.join(icons,'xerox-hand-reach-02.png'); hand.save(f); quant(f,16)

# 9 微細粒子オーバーレイ
S2=2048; rng=np.random.default_rng(9); T=128; noise=rng.integers(0,256,(T,T),dtype=np.uint8)
alpha=np.where(noise>210,np.clip((noise-210)*2,0,65),np.where(noise<35,(35-noise),0)).astype(np.uint8); alpha=(alpha//8)*8
ra=np.zeros((T,T,4),dtype=np.uint8); ra[...,:3]=np.where(noise[...,None]>127,255,20); ra[...,3]=alpha; tile=Image.fromarray(ra,'RGBA'); im=Image.new('RGBA',(S2,S2))
for y in range(0,S2,T):
  for x in range(0,S2,T): im.alpha_composite(tile,(x,y))
d=ImageDraw.Draw(im)
for i in range(300):
    x=random.randrange(S2); y=random.randrange(S2); rr=random.choice([1,1,2,3]); d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(255,255,255,random.randint(20,60)))
f=os.path.join(textures,'micro-grain-overlay-01.png'); im.quantize(colors=32,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).save(f,optimize=True,compress_level=9)

# 10 リソ色面
Y,X=np.mgrid[0:S2,0:S2]; base=np.zeros((S2,S2,3),float)+245
for (fx,fy),sig,col,amp in [((520,1420),680,(25,85,235),.9),((1480,640),760,(255,75,160),.85),((1180,1560),700,(190,255,45),.75),((250,250),560,(95,40,180),.45)]:
    a=np.exp(-((X-fx)**2+(Y-fy)**2)/(2*sig**2))*amp; base=base*(1-a[...,None])+np.array(col)*a[...,None]
base=np.clip(base-12*(((X%12<2)&(Y%12<2))[...,None]),0,255).astype(np.uint8)
f=os.path.join(textures,'riso-color-field-02.png'); Image.fromarray(base,'RGB').quantize(colors=32,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(f,optimize=True,compress_level=9)

# 11 青紫の光跡
im=Image.new('RGB',(S2,S2),(3,5,16)); glow=Image.new('RGBA',(S2,S2),(0,0,0,0)); gd=ImageDraw.Draw(glow)
for n,col in enumerate([(80,150,255,240),(120,65,255,230),(235,60,255,210),(180,220,255,180)]):
    pts=[(-150+i*28,1180+260*math.sin(i/11+n*.9)+120*math.sin(i/4.8+n)) for i in range(90)]; gd.line(pts,fill=col,width=12+4*n)
im=Image.alpha_composite(im.convert('RGBA'),glow.filter(ImageFilter.GaussianBlur(34))); im=Image.alpha_composite(im,glow); sd=ImageDraw.Draw(im)
for off in [-180,180,340]: sd.line([(-100+i*26,520+off+140*math.sin(i/8+off/100)) for i in range(95)],fill=(70,110,255,110),width=4)
f=os.path.join(textures,'blue-violet-light-trail-02.png'); im.convert('RGB').quantize(colors=32,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(f,optimize=True,compress_level=9)

# 12 アーチ型フレーム
im=rgba(); d=ImageDraw.Draw(im); left,right,bottom=220,804,864
d.line((left,452,left,bottom),fill='white',width=5); d.line((right,452,right,bottom),fill='white',width=5); d.line((left,bottom,right,bottom),fill='white',width=5); d.arc((left,160,right,744),180,360,fill='white',width=5)
for x in range(left,right+1,58): d.line((x,bottom+22,x,bottom+42),fill=(255,255,255,170),width=2)
d.line((left-42,420,left-10,420),fill=(191,255,43,255),width=4); d.line((right+10,420,right+42,420),fill=(191,255,43,255),width=4); d.ellipse((192,132,832,892),outline=(255,255,255,70),width=2)
f=os.path.join(icons,'arch-frame-technical-01.png'); im.save(f); quant(f,24)
save_svg('arch-frame-technical-01.svg','<path d="M220 864 L220 452 A292 292 0 0 1 804 452 L804 864 Z" fill="none" stroke="white" stroke-width="5"/><ellipse cx="512" cy="512" rx="320" ry="380" fill="none" stroke="white" stroke-width="2" opacity=".3"/><line x1="178" y1="420" x2="210" y2="420" stroke="#bfff2b" stroke-width="4"/><line x1="814" y1="420" x2="846" y2="420" stroke="#bfff2b" stroke-width="4"/>')
print('Generated FLYRA Pack 03: 12 PNG + 7 SVG')
