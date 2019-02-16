import rimraf from 'rimraf';
import notify from 'umi-notify';
// import getRouteManager from '../getRouteManager';
// import getFilesGenerator from '../getFilesGenerator';

export default function(api) {
  const { service, debug, config, log } = api;
  const { cwd, paths } = service;

  api.registerCommand(
    'build',
    {
      webpack: true,
      description: 'building for production',
    },
    () => {
      notify.onBuildStart({ name: 'umi', version: 2 });

      // const RoutesManager = getRouteManager(service);
      // RoutesManager.fetchRoutes();

      process.env.NODE_ENV = 'production';
      service.applyPlugins('onStart');

      // const filesGenerator = getFilesGenerator(service, {
      //   RoutesManager,
      //   mountElementId: config.mountElementId,
      // });
      // filesGenerator.generate();

      return new Promise((resolve, reject) => {
        require('n-webpack/build').default({
          cwd,
          webpackConfig: service.webpackConfig,
          onSuccess({ stats }) {
            debug('Build success');
            if (process.env.RM_TMPDIR !== 'none') {
              debug(`Clean tmp dir ${service.paths.tmpDirPath}`);
              rimraf.sync(paths.absTmpDirPath);
            }
            service.applyPlugins('onBuildSuccess', {
              args: {
                stats,
              },
            });
            debug('Build success end');

            notify.onBuildComplete({ name: 'umi', version: 2 }, { err: null });
            resolve();
          },
          onFail({ err, stats }) {
            service.applyPlugins('onBuildFail', {
              args: {
                err,
                stats,
              },
            });
            notify.onBuildComplete({ name: 'umi', version: 2 }, { err });
            reject(err);
          },
        });
      });
    },
  );
}
