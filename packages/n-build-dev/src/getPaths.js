import {join} from 'path';
import {existsSync, statSync} from 'fs';

function test(path) {
    return existsSync(path) && statSync(path).isDirectory();
}

function template(path) {
    return join(__dirname, '../template', path);
}

export default function (service) {
    const {cwd, config} = service;
    const outputPath = config.outputPath || './dist';

    let pagesPath = 'views';
    if (process.env.PAGES_PATH) {
        pagesPath = process.env.PAGES_PATH;
    } else {
        if (test(join(cwd, 'app/views'))) {
            pagesPath = 'app/views';
        }
    }

    const absPagesPath = join(cwd, pagesPath);
    const absSrcPath = join(absPagesPath, '../');

    const envAffix = process.env.NODE_ENV === 'development' ? '' : `-production`;
    const tmpDirPath = process.env.UMI_TEMP_DIR
        ? `${process.env.UMI_TEMP_DIR}${envAffix}`
        : `${pagesPath}/.archer${envAffix}`;

    const absTmpDirPath = join(cwd, tmpDirPath);

    return {
        cwd,
        outputPath,
        absOutputPath: join(cwd, outputPath),
        absNodeModulesPath: join(cwd, 'node_modules'),
        pagesPath,
        absPagesPath,
        absSrcPath,
        tmpDirPath,
        absTmpDirPath,
        appSrc: join(cwd, 'app'),
        absRegisterSWJSPath: join(absTmpDirPath, 'registerServiceWorker.js'),
        absPageDocumentPath: join(absPagesPath, 'document.ejs'),
        defaultEntryTplPath: template('entry.js.tpl'),
        defaultRouterTplPath: template('router.js.tpl'),
        defaultHistoryTplPath: template('history.js.tpl'),
        defaultRegisterSWTplPath: template('registerServiceWorker.js'),
        defaultDocumentPath: template('document.ejs'),
    };
}
