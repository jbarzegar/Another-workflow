import gulp from 'gulp'

import bs from 'browser-sync'

import $ from 'gulp-util'

import watcher from './tasks/watcher'
import devServer from './conf/dev-server'
import build from './tasks/build'

gulp.task('watcher', ['dev-server'], () => {
  watcher(bs)
})

gulp.task('dev-server', () => {
  devServer(bs)
})

gulp.task('build', () => {
  build()
})

gulp.task('default', ['watcher'])
