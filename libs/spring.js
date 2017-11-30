var log = require("../utils/moliLogUtil");
var request = require('request');
var inquirer = require('inquirer');
var path = require('path');
var pathExists = require('path-exists');
var fs = require('fs');
var download = require('download-git-repo');

module.exports = {
    boot: function (args) {
        // 获取可以创建的模板列表
        log.info("Available official moli backend porject templates:");
        var repoNameData = [];
        request({
            url: 'https://api.github.com/users/molispring/repos',
            headers: {
                'User-Agent': 'molispring'
            }
        }, function (err, res, body) {
            if (err) {
                log.error(err);
                process.exit(1);
            }
            var requestBody = JSON.parse(body);
            if (Array.isArray(requestBody)) {
                requestBody.forEach(function (repo, index) {
                    if (repo.name.match("tpl-")) {
                        repoNameData.push(`${repo.name} - ${repo.description}`);
                    }
                });
                //TODO 人机交互
                inquirer.prompt([{
                    type: 'rawlist',
                    name: 'selectRepo',
                    message: 'Please enter template number::',
                    choices: repoNameData
                }]).then(function (answers) {
                    var selectName = answers.selectRepo.split(' - ')[0];
                    var questions = [{
                        type: 'input',
                        name: 'selectName',
                        message: 'Input Your Project Name (default:moli-demo):',
                        default: function () {
                            return 'moli-demo';
                        }
                    }];
                    inquirer.prompt(questions).then(function (answers) {
                        var name = answers.selectName,
                            template = selectName;
                        var root = path.resolve(name);
                        if (!pathExists.sync(name)) {
                            fs.mkdirSync(root);
                        } else {
                            log.error(`Directory ${name} Already Exists.`);
                            process.exit(0);
                        }
                        log.info(`Downloading ${template} please wait.`);
                        var downloadStartTime = new Date().getTime();
                        var downloadTimer = setInterval(function () {
                            log.logInLine(".", "#00bb00");
                        }, 1000);
                        //TODO 开始下载
                        download(`molispring/${template}`, `${name}`, function (err) {
                            if (!err) {
                                // 完成下载
                                clearInterval(downloadTimer);
                                var downloadUsedTime = (new Date().getTime() - downloadStartTime) / 1000;
                                log.log("");
                                log.info(`Download ${name} Done.Used Time：${downloadUsedTime}s`);
                                // 这里需要初始化配置文件和项目文件,如果需要
                            } else {
                                log.error(requestBody.message);
                            }
                        });
                    });
                });
            }
        });
    }
};
