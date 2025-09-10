// Boy.ts
import { _decorator, Component, Node, Vec3, BoxCollider2D, Contact2DType, UITransform, tween, sp } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Boy')
export class Boy extends Component {
    @property moveSpeed = 100;
    @property minReward = 1;
    @property maxReward = 3;
    @property walkAnim = 'walk';
    @property deathAnim = 'death';
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null!;
    @property(BoxCollider2D)
    col: BoxCollider2D = null!;

    private gameManager!: GameManager;
    private alive = false;
    private dir = 1;
    private areaW = 1300;

    // onLoad() {
    // }

    init(gameManager: GameManager, fromLeft: boolean) {
        this.gameManager = gameManager;
        this.alive = true;
        this.dir = fromLeft ? 1 : -1;
        this.areaW = gameManager.gameArea.getComponent(UITransform)?.width ?? 1300;

        this.node.active = true;
        this.node.setScale(fromLeft ? 0.3 : -0.3, 0.3, 0.3);
        this.playWalk();
    }

    update(dt: number) {
        if (!this.alive) return;

        const pos = this.node.position;
        const newX = pos.x + this.moveSpeed * this.dir * dt;
        this.node.setPosition(newX, pos.y);

        if (Math.abs(newX) > this.areaW / 2 + 120) this.despawn();
    }

    onHit() {
        if (!this.alive) return;
        this.alive = false;
        this.col.enabled = false;

        const reward = Math.floor(Math.random() * (this.maxReward - this.minReward + 1)) + this.minReward;
        this.playDeath(() => this.scheduleOnce(() => this.despawn(), 1.0));
        this.playCoin(reward);
    }

    private playWalk() {
        this.skeleton?.setAnimation(0, this.walkAnim, true);
    }

    private playDeath(callback?: Function) {
        if (this.skeleton) {
            this.skeleton.setAnimation(0, this.deathAnim, false);
            this.skeleton.setCompleteListener((trackEntry) => {
                if (trackEntry.animation?.name === this.deathAnim && callback) callback();
            });
        } 
        // else {
        //     tween(this.node).to(0.3, { scale: Vec3.ZERO }).call(() => callback?.()).start();
        // }
    }

    private playCoin(reward: number) {
        this.gameManager.getCoinEffect().createCoinFlyEffect(this.node.position.clone(), 1, reward);
    }

    private despawn() {
        this.node.active = false;
        this.col.enabled = true;
        this.node.setScale(1, 1, 1);
        this.gameManager.recycleBoy(this.node);
    }

    onDisable() { 
        this.alive = false; 
    }
}