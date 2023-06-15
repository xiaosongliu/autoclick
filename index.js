const co = require('co');
const prompt = require('co-prompt');
const robot = require("robotjs");

const config = {
    delay: 5,
    interval: 2,
    pos: {
        x: 0,
        y: 0
    }
}

const getPos = () => {
    return new Promise((res, fail) => {
        try {
            let times = 1;
            const obj = setInterval(() => {
                times++;
                let num = config.delay - times;
                if (times == config.delay) {
                    clearInterval(obj)
                }
                process.stdout.write(`${num}...`);
            }, 1000);
            setTimeout(() => {
                process.stdout.write("\n");
                const mouse = robot.getMousePos();
                res(mouse);
            }, config.delay * 1000);

        } catch (e) {
            fail(e)
        }
    });
}

const getClick = () => {
    return new Promise((res, fail) => {
        try {
            robot.moveMouse(config.pos.x, config.pos.y);
            robot.mouseClick();
            setTimeout(() => {
                res(true);
            }, config.interval * 1000);

        } catch (e) {
            fail(e)
        }
    });
}

function *run() {
    process.stdout.write("请将命令窗口与需要点击的窗口并排在桌面上");
    const count = yield prompt('输入需要点击的次数：');
    config.interval = yield prompt('输入每次点击的时间时隔（秒）：');
    if (count) {
        process.stdout.write(`请将鼠标移动到需要点击的按钮上，${config.delay}秒后执行自动点击\n`);

        const pos = yield getPos();
        config.pos.x = pos.x;
        config.pos.y = pos.y;

        process.stdout.write(`开始点击按钮：X=${pos.x}, Y=${pos.y}\n`);

        for (let i = 1; i <= count; i++) {
            let isClick = yield getClick();
            let str = isClick ? 'true' : 'false';

            process.stdout.write(`点击 ${i} 次，结果：${str}\n`);
        }

        process.stdout.write(`点击完成。\n`);
        process.exit();
    }
}

co(run);
