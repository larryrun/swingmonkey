// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    monkey: cc.Node = null;

    @property
    swingSpeed: number = 0;

    @property(cc.Prefab)
    ceilingPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ropeSegPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onTouchStart(e) {
        let monkeyBodyArmatureDisplay = this.monkey.getComponentInChildren(dragonBones.ArmatureDisplay);
        monkeyBodyArmatureDisplay.playAnimation('SwingForward', 0);
        let rigibody = this.monkey.getComponent(cc.RigidBody)
        rigibody.linearVelocity = cc.v2(300, 0)
        this.putRope(100, 0);
    }

    onTouchEnd(e) {
        let monkeyBodyArmatureDisplay = this.monkey.getComponentInChildren(dragonBones.ArmatureDisplay);
        monkeyBodyArmatureDisplay.playAnimation('Jump', 0);
        let ropeJoint = this.monkey.getComponent(cc.RopeJoint);
        ropeJoint.destroy();
    }

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START.toString(), this.onTouchStart.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_END.toString(), this.onTouchEnd.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_CANCEL.toString(), this.onTouchEnd.bind(this))
        let physics = cc.director.getPhysicsManager();
        physics.enabled = true;
        physics.gravity = cc.v2(0, -320);
        physics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
            ;
    }

    putRope(x: number, length: number) {
        let ceilingNode = cc.instantiate(this.ceilingPrefab);
        ceilingNode.setPosition(x, this.node.position.y - 10);
        let ceilingRigidBody = ceilingNode.addComponent(cc.RigidBody);
        ceilingRigidBody.type = cc.RigidBodyType.Static;
        this.node.addChild(ceilingNode);

        let lastRopeSegRigidBody = ceilingRigidBody;
        for(let i = 0; i < length; i++) {
            let ropeSegNode = cc.instantiate(this.ropeSegPrefab);
            let ropeJoint = ropeSegNode.getComponentInChildren(cc.RopeJoint);
            ropeJoint.connectedBody = lastRopeSegRigidBody;
            ropeJoint.maxLength = 5;
            this.node.addChild(ropeSegNode);
        }
    }

    start () {
    }

    update (dt) {
    }
}