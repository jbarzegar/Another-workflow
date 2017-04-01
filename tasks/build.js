import gulp from 'gulp'
import util, { colors } from 'gulp-util'
const green = colors.green

// Webpack and Js
import webpack from 'webpack-stream'
import named from 'vinyl-named'
import config from '../conf/webpack.build.config'

import inject from 'gulp-inject'
import scss from 'gulp-sass'
import pcss from 'gulp-postcss'

// Pcss plugins
import autoprefixer from 'autoprefixer'
import rucksack from 'rucksack-css'
import packer from 'css-mqpacker'
import cssnano from 'cssnano'
import uncss from 'postcss-uncss'

const injectFiles = gulp.src([
  'src/modules/**/*.scss'
], { read: false })

const injectOps = {
  starttag: '/* inject:start */',
  endtag: '/* inject:end */',
  addRootSlash: false,
  transform: filepath => `@import '${filepath}'`
}

const uncssFiles = { html: [html.dev.in] }

const plugins = [
  autoprefixer({
    browsers: ['last 7 versions']
  }),
  rucksack(),
  uncss(uncssFiles),
  packer({ sort: true }),
  cssnano()
]

import { scripts, styles, html } from '../conf/paths'

function handleErr(err) {
  util.log(err.toString())

  this.emit('end')
}

function moveHtml(index) {
  return new Promise((resolve, reject) => {
    // If it's an index file
    const template = {
      in: index ? html.dev.in : html.dev.watch,
      out: index ? html.prod.root_out : html.prod.templates_out
    }

    if (index) {
      util.log('Moving index...')
    } else {
      util.log('Moving templates...')
    }

    gulp.src(template.in)
    .pipe(gulp.dest(template.out))
    .on('end', resolve(true))
  })
}

function compileStyles() {
  util.log('Building styles...')
  return new Promise(resolve => {
    gulp.src(styles.dev.in)
      .pipe(inject(injectFiles, injectOps))
      .pipe(scss({ outputStyle: 'compressed' }))
      .on('error', handleErr)
      .pipe(pcss(plugins))
      .pipe(gulp.dest(styles.prod.out))
      .on('end', () => { util.log(green('Styles done')); resolve(true) })
  })
}

function compileScripts() {
  return new Promise(resolve => {
    gulp.src([scripts.dev.in])
        .pipe(named())
        .pipe(webpack(config), require('webpack'))
        .on('error', handleErr)
        .pipe(gulp.dest(scripts.prod.out))
        .on('end', () => { util.log(green('Scripts done')); resolve(true) })
  })
}

function compile() {
  util.log('Building')
  // Move index
  moveHtml(true)
  .then(moveHtml())
  .then(compileStyles())
  .then(compileScripts())
  .catch(err => err)
}

export default compile
