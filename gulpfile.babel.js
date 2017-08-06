import { readFileSync } from 'fs';
import gulp from 'gulp';
import cached from 'gulp-cached';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import remember from 'gulp-remember';

const babelrc = JSON.parse(readFileSync('./.babelrc', 'utf8'));

const path = {
    libraries: {
        target: 'sources/**/*.js',
        output: 'libraries',
        sourcemaps: true,
        pipelining: [ babel(babelrc) ]
    }
};

for(const [ task, option ] of Object.keys(path).map(name => [ `build:${name}`, path[name] ])) {
    gulp.task(task, () => {
        let pipeline = gulp.src(option.target);

        if(option.sourcemaps) {
            pipeline = pipeline.pipe(sourcemaps.init());
        }

        for(const item of option.pipelining) {
            pipeline = pipeline.pipe(item);
        }

        if(option.sourcemaps) {
            pipeline = pipeline.pipe(sourcemaps.write());
        }

        return pipeline.pipe(remember(task)).pipe(gulp.dest(option.output));
    });
}

gulp.task('build', [ 'build:libraries' ]);

gulp.task('watch', () => {
    for(const [ task, target ] of Object.keys(path).map(name => [ `build:${name}`, path[name].target ])) {
        gulp.watch(target, [ task ]).on('change', ({ type, path }) => {
            if(type !== 'deleted') {
                return;
            }

            Reflect.deleteProperty(cached.caches[task], path);
            remember.forget(task, path);
        });
    }
});

gulp.task('default', [ 'build' ]);
