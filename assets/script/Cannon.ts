// Cannon.ts
import { _decorator, Component, input, Input, EventKeyboard, KeyCode, Vec3, UITransform } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Component {
    @property moveSpeed = 700;

    private gameManager!: GameManager;
    private isLeft = false;
    private isRight = false;
    private areaW = 1300;
    private cannonW = 60;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.cannonW = this.node.getComponent(UITransform)?.width ?? 60;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    init(gameManager: GameManager) {
        this.gameManager = gameManager;
        const areaTransform = gameManager.gameArea.getComponent(UITransform);
        this.areaW = areaTransform?.width ?? 1300;
        const areaH = areaTransform?.height ?? 600;
        this.node.setPosition(0, -areaH / 2 + 80);
    }

    private onKeyDown(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.SPACE:
                this.fire();
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.isLeft = true;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.isRight = true;
                break;
        }
    }

    private onKeyUp(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.isLeft = false;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.isRight = false;
                break;
        }
    }

    private fire() {
        if (!this.gameManager) return;
        const pos = this.node.position;
        this.gameManager.fireBullet(new Vec3(pos.x, pos.y + 30, 0));
    }

    update(dt: number) {
        const pos = this.node.position.clone();
        const fullArea = this.areaW;
        const minX = -fullArea + this.cannonW;
        const maxX = fullArea - this.cannonW;

        if (this.isLeft && !this.isRight) pos.x = Math.max(minX, pos.x - this.moveSpeed * dt);
        if (this.isRight && !this.isLeft) pos.x = Math.min(maxX, pos.x + this.moveSpeed * dt);

        if (pos.x !== this.node.position.x) this.node.setPosition(pos);
    }
}