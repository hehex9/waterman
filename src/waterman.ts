import fs from 'fs'
import {join, basename} from 'path'
import {createCanvas, loadImage} from 'canvas'

export interface Options {
  file: string
  out: string
  text: string
  verbose?: boolean
}

export async function generate(fileName: string, text: string, dir = '') {
  const split = fileName.split('.')
  const ext = split.pop()
  const name = split.join('.')

  const image = await loadImage(fileName)
  const {width, height} = image
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const max = Math.max(height, width)

  ctx.drawImage(image, 0, 0)
  ctx.font = `${max / (text.length * 1.5)}px Helvetica`
  ctx.fillStyle = 'rgba(255,0,0,0.7)'
  ctx.rotate((-25 * Math.PI) / 180)

  if (width > height) {
    ctx.fillText(text, -width / 10, height)
  } else {
    ctx.fillText(text, -width / 2, height / 1.5)
  }

  return new Promise((resolve) => {
    canvas
      .createJPEGStream()
      .pipe(
        fs.createWriteStream(join(dir, `${basename(name)}-generated.${ext}`))
      )
      .on('finish', resolve)
  })
}

export async function watermark(options: Options) {
  const {file, text, out} = options

  if (!fs.existsSync(out)) {
    fs.mkdirSync(out)
  }

  const files = []
  if (fs.statSync(file).isDirectory()) {
    const dir = fs.readdirSync(file)
    for (const f of dir) {
      if (f.endsWith('jpeg') || f.endsWith('jpg') || f.endsWith('png')) {
        files.push(join(file, f))
      }
    }
  } else {
    files.push(file)
  }

  for (const f of files) {
    await generate(f, text, out)
    if (options.verbose) {
      console.log(f)
    }
  }
}
