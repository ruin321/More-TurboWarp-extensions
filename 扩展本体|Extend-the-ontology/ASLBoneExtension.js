// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name ASLBoneExtension.js
// ==/ClosureCompiler==

(function(ext) {
    ext._shutdown = function() {};
    ext._getStatus = function() {
        return {status: 2, msg: '就绪'};
    };

    const BONE_TYPES = {
        SIMPLE: 'Simple',
        ASIMPLE: 'Asimple',
        WALL: 'Wall',
        AWALL: 'Awall',
        CIRCLE: 'Circle'
    };

    const EASING_TYPES = {
        LINEAR: 'linear',
        QUAD_IN: 'quadIn',
        QUAD_OUT: 'quadOut',
        QUAD_INOUT: 'quadInOut',
        CUBIC_IN: 'cubicIn',
        CUBIC_OUT: 'cubicOut',
        CUBIC_INOUT: 'cubicInOut',
        BOUNCE_IN: 'bounceIn',
        BOUNCE_OUT: 'bounceOut',
        BOUNCE_INOUT: 'bounceInOut',
        ELASTIC_IN: 'elasticIn',
        ELASTIC_OUT: 'elasticOut',
        ELASTIC_INOUT: 'elasticInOut'
    };

    let currentBoneData = null;

    ext.initBone = function() {
        currentBoneData = {
            baseInfo: [0, 0, 0, 0, 0, 1, 210, 0, 3, 0], // 基础信息
            shapeInfo: ["Asimple"], // 图形信息
            changes: [] // 变化列表
        };
        return "骨头数据已初始化";
    };

    ext.setBaseInfo = function(x, y, angle, length, appearance, clipMode, lifetime, bound) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.baseInfo = [
            x, y, angle, length, appearance, clipMode, lifetime, 0, 3, bound
        ];
        return "基础信息已设置";
    };

    ext.setSimpleBone = function() {
        if (!currentBoneData) ext.initBone();
        currentBoneData.shapeInfo = [BONE_TYPES.SIMPLE];
        return "设置为单根骨头";
    };

    ext.setASimpleBone = function() {
        if (!currentBoneData) ext.initBone();
        currentBoneData.shapeInfo = [BONE_TYPES.ASIMPLE];
        return "设置为旋转中心在一端的单根骨头";
    };

    ext.setBoneWall = function(count, spacing) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.shapeInfo = [BONE_TYPES.WALL, count, spacing];
        return "设置为骨墙";
    };

    ext.setABoneWall = function(count, spacing) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.shapeInfo = [BONE_TYPES.AWALL, count, spacing];
        return "设置为旋转中心在一端的骨墙";
    };

    ext.setBoneCircle = function(count, angleStep, radiusX, radiusY, circleAngle) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.shapeInfo = [BONE_TYPES.CIRCLE, count, angleStep, radiusX, radiusY, circleAngle];
        return "设置为骨圈";
    };

    ext.addCPChange = function(endTime, x1, y1, d1, l1, x2, y2, d2, l2) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.changes.push([
            "CP", endTime,
            x1, y1, d1, l1,
            x2, y2, d2, l2
        ]);
        return `添加了加速度变化，结束时间: ${endTime}`;
    };

    ext.addSPChange = function(endTime, ease1, ease2, duration, x1, y1, d1, l1, x2, y2, d2, l2) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.changes.push([
            "SP", endTime,
            ease1, ease2, duration, 0,
            x1, y1, d1, l1,
            x2, y2, d2, l2
        ]);
        return `添加了节点变化，结束时间: ${endTime}`;
    };

    ext.addWTChange = function(endTime) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.changes.push(["WT", endTime]);
        return `添加了等待变化，结束时间: ${endTime}`;
    };

    ext.generateBoneArray = function() {
        if (!currentBoneData) return "[]";
        
        const boneArray = [
            currentBoneData.baseInfo,
            currentBoneData.shapeInfo,
            ...currentBoneData.changes
        ];
        
        return JSON.stringify(boneArray);
    };
    ext.importBoneArray = function(arrayString) {
        try {
            const boneArray = JSON.parse(arrayString);
            if (Array.isArray(boneArray) && boneArray.length >= 2) {
                currentBoneData = {
                    baseInfo: boneArray[0],
                    shapeInfo: boneArray[1],
                    changes: boneArray.slice(2)
                };
                return "骨头数据导入成功";
            }
        } catch (e) {
            return "导入失败: 数据格式错误";
        }
        return "导入失败";
    };

    ext.enableCorrection = function(enable) {
        if (!currentBoneData) ext.initBone();
        currentBoneData.correction = enable;
        return enable ? "修正已开启" : "修正已关闭";
    };

    ext.getExampleBone = function() {
        const example = [
            [0,0,0,0,0,1,210,0,3,0],
            ["Asimple"],
            ["SP",100,"bounce","out",100,0,50,-12,0,30,50,-148,0,30],
            ["CP",125,0,0,0,2.5,-0.1,0,0,-0.1],
            ["CP",210,-2.4,0,0,0,-0.1,0,0,0]
        ];
        return JSON.stringify(example);
    };

    ext.resetBoneData = function() {
        currentBoneData = null;
        return "骨头数据已重置";
    };

    ext.getBonePreview = function() {
        if (!currentBoneData) return "没有骨头数据";
        
        let preview = "=== 骨头数据预览 ===\n";
        preview += `基础信息: [${currentBoneData.baseInfo.join(", ")}]\n`;
        preview += `图形类型: ${currentBoneData.shapeInfo[0]}\n`;
        preview += `变化数量: ${currentBoneData.changes.length}\n`;
        
        currentBoneData.changes.forEach((change, index) => {
            preview += `变化${index + 1}: ${change[0]} (结束时间: ${change[1]})\n`;
        });
        
        return preview;
    };

    var descriptor = {
        blocks: [
            [' ', '初始化骨头数据', 'initBone'],
            [' ', '重置骨头数据', 'resetBoneData'],
            ['r', '获取骨头数据预览', 'getBonePreview'],
            [' ', '设置基础信息 X:%n Y:%n 角度:%n 长度:%n 外观:%n 裁剪模式:%n 存在时间:%n 绑定战斗框:%n', 
                'setBaseInfo', 0, 0, 0, 0, 0, 1, 210, 0],
            [' ', '设置为单根骨头', 'setSimpleBone'],
            [' ', '设置为旋转中心在一端的单根骨头', 'setASimpleBone'],
            [' ', '设置为骨墙 数量:%n 间隔:%n', 'setBoneWall', 5, 10],
            [' ', '设置为旋转中心在一端的骨墙 数量:%n 间隔:%n', 'setABoneWall', 5, 10],
            [' ', '设置为骨圈 数量:%n 角度间隔:%n 横半径:%n 纵半径:%n 骨圈角度:%n', 
                'setBoneCircle', 8, 45, 50, 50, 0],
            
            [' ', '添加加速度变化 结束时间:%n X1速度:%n Y1速度:%n 角度1速度:%n 长度1速度:%n X2加速度:%n Y2加速度:%n 角度2加速度:%n 长度2加速度:%n', 
                'addCPChange', 100, 0, 0, 0, 0, 0, 0, 0, 0],
            [' ', '添加节点变化 结束时间:%n 缓动1:%m.easing 缓动2:%m.easing 持续时间:%n X1:%n Y1:%n 角度1:%n 长度1:%n X2:%n Y2:%n 角度2:%n 长度2:%n', 
                'addSPChange', 100, 'linear', 'linear', 100, 0, 0, 0, 0, 100, 100, 0, 0],
            [' ', '添加等待变化 结束时间:%n', 'addWTChange', 50],
            ['r', '生成骨头数组', 'generateBoneArray'],
            [' ', '导入骨头数组 %s', 'importBoneArray', ''],
            ['r', '获取示例骨头', 'getExampleBone'],
            [' ', '启用修正 %b', 'enableCorrection', true],
        ],
        menus: {
            easing: Object.keys(EASING_TYPES)
        }
    };
    ScratchExtensions.register('ASL Engine V2 骨头弹幕系统', descriptor, ext);
})({});