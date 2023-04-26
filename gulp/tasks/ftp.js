import { configFTP } from "../config/ftp.js";
import vinylFTP from "vinyl-ftp";
import util from "gulp-util";
import { appendFile } from "fs";


export const ftp = () => {
        configFTP.log = util.log;
        const ftpConnect = vinylFTP.create(configFTP);
        return appendFile.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
                .pipe(app.plugins.plumber(
                        app.plugins.notify.onError({
                                title: "FTP",
                                message: "Error: <%= error.massage %>"
                        }))
                )
                .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`));
}
