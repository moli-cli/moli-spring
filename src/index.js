var log = require("../utils/moliLogUtil");

/**
 * 获取帮助
 */
function getHelp() {
    log.log("  Usage : ");
    log.log("");
    log.log("  moli spring [options]");
    log.log("");
    log.log("  options:");
    log.log("");
    log.log("    -h, --help         spring help");
    log.log("    -v, --version      moli-spring version");
    log.log("");
    log.log("  Examples:");
    log.log("");
    log.log("    $ moli spring");
    log.log("");
    process.exit(0);
}

/**
 * 版本
 */
function getVersion() {
    log.success("version:" + require("../package.json").version);
    process.exit(0);
}

module.exports = {
    plugin: function (options) {
        var args = {};
        args.commands = options.cmd;
        args.pluginname = options.name;
        if (options.argv.h || options.argv.help) {
            getHelp();
        }
        if (options.argv.v || options.argv.version) {
            getVersion();
        }
        // 这里直接调用spring的方法来执行
        var spring = require("../libs/spring");
        spring.boot(args);
    }
};
