// Bullet.ts
import { _decorator, Component, Node, BoxCollider2D, Contact2DType, Collider2D, UITransform } from 'cc';
import { GameManager } from './GameManager';
import { Boy } from './Boy';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property moveSpeed = 480;
    @property(BoxCollider2D)
    col: BoxCollider2D = null!;

    private gameManager!: GameManager;
    private alive = false;
    private areaH = 600;

    onLoad() {
        this.col.on(Contact2DType.BEGIN_CONTACT, this.onBegin, this);
    }

    init(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.alive = true;
        this.areaH = gameManager.gameArea.getComponent(UITransform)?.height ?? 600;
        this.node.active = true;
    }

    update(dt: number) {
        if (!this.alive) return;

        const pos = this.node.position;
        const newY = pos.y + this.moveSpeed * dt;
        this.node.setPosition(pos.x, newY);

        if (newY > this.areaH / 2 + 60) this.kill(false);
    }

    private onBegin(_self: Collider2D, other: Collider2D) {
        if (!this.alive) return;

        const parentBoy = other.node.parent?.getComponent(Boy);
            if (parentBoy) {
                parentBoy.onHit();
                this.kill(true);
            }
    }

    private kill(hit: boolean) {
        if (!this.alive) return;
        this.alive = false;
        this.node.active = false;
        this.gameManager.recycleBullet(this.node, hit);
    }

    onDisable() { 
        this.alive = false; 
    }
}