// GameManager.ts
import { _decorator, Component, Node, Prefab, instantiate, NodePool, PhysicsSystem2D, EPhysics2DDrawFlags, Label, UITransform, Vec3 } from 'cc';
import { Cannon } from './Cannon';
import { Boy } from './Boy';
import { CoinEffect } from './CoinEffect';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    cannon: Node = null!;
    @property(Prefab)
    bulletPrefab: Prefab = null!;
    @property(Prefab)
    boyPrefab: Prefab = null!;
    @property(Prefab)
    coinPrefab: Prefab = null!;
    @property(Node)
    gameArea: Node = null!;
    @property(Node)
    balanceLabel: Node = null!;

    private bulletPool = new NodePool();
    private boyPool = new NodePool();
    private cannonComponent: Cannon = null!;
    private coinEffect: CoinEffect = null!;
    private balance = 100;

    onLoad() {
        const physics = PhysicsSystem2D.instance;
        physics.enable = true;
        physics.gravity.set(0, 0);
        physics.debugDrawFlags = EPhysics2DDrawFlags.Shape;

        this.cannonComponent = this.cannon.getComponent(Cannon)!;
        this.cannonComponent.init(this);

        this.coinEffect = this.node.addComponent(CoinEffect);
        this.coinEffect.init(this);

        this.updateUI();
        this.scheduleRandomBoySpawn();
    }

    fireBullet(worldPos: Vec3) {
        if (this.balance <= 0) return;

        const bullet = this.bulletPool.size() > 0 ? this.bulletPool.get()! : instantiate(this.bulletPrefab);
        bullet.setParent(this.gameArea);
        bullet.setPosition(worldPos);
        bullet.getComponent(Bullet)!.init(this);

        this.balance--;
        this.updateUI();
    }

    private scheduleRandomBoySpawn() {
        this.scheduleOnce(() => {
            this.spawnBoy();
            this.scheduleRandomBoySpawn();
        }, 1 + Math.random() * 1);
    }

    private spawnBoy() {
        const boy = this.boyPool.size() > 0 ? this.boyPool.get()! : instantiate(this.boyPrefab);
        boy.setParent(this.gameArea);

        const areaW = this.gameArea.getComponent(UITransform)?.width ?? 1300;
        const fromLeft = Math.random() > 0.5;
        const startX = fromLeft ? -areaW / 2 - 60 : areaW / 2 + 60;
        const y = (Math.random() * 300) - 150;

        boy.setPosition(startX, y);
        boy.getComponent(Boy)!.init(this, fromLeft);
    }

    recycleBullet(bullet: Node, hit = false) {
        bullet.active = false;
        this.bulletPool.put(bullet);
        if (!hit) {
            this.balance++;
            this.updateUI();
        }
    }

    recycleBoy(boy: Node) {
        boy.active = false;
        boy.setScale(1, 1, 1);
        this.boyPool.put(boy);
    }

    addScore(points: number) {
        this.balance += points;
        this.updateUI();
    }

    private updateUI() {
        const label = this.balanceLabel?.getComponent(Label);
        if (label) label.string = `${this.balance}`;
    }

    getCoinEffect(): CoinEffect {
        return this.coinEffect;
    }

    getCoinPrefab(): Prefab {
        return this.coinPrefab;
    }
}



// // GameManager.ts
// import { _decorator, Component, Node, Prefab, instantiate, NodePool, PhysicsSystem2D, EPhysics2DDrawFlags, Label, UITransform, Vec3 } from 'cc';
// import { Cannon } from './Cannon';
// import { Boy } from './Boy';
// import { CoinEffect } from './CoinEffect';
// import { Bullet } from './Bullet';
// const { ccclass, property } = _decorator;

// @ccclass('GameManager')
// export class GameManager extends Component {
//     @property(Node)
//     cannon: Node = null!;
//     @property(Prefab)
//     bulletPrefab: Prefab = null!;
//     @property(Prefab)
//     boyPrefab: Prefab = null!;
//     @property(Node)
//     gameArea: Node = null!;
//     @property(Node)
//     balanceLabel: Node = null!;

//     private bulletPool = new NodePool();
//     private boyPool = new NodePool();
//     private cannonComponent: Cannon = null!;
//     private coinEffect: CoinEffect = null!;
//     private balance = 100;

//     onLoad() {
//         const physics = PhysicsSystem2D.instance;
//         physics.enable = true;
//         physics.gravity.set(0, 0);
//         physics.debugDrawFlags = EPhysics2DDrawFlags.Shape;

//         this.cannonComponent = this.cannon.getComponent(Cannon)!;
//         this.cannonComponent.init(this);

//         this.coinEffect = this.node.addComponent(CoinEffect);
//         this.coinEffect.init(this);

//         this.updateUI();
//         this.scheduleRandomBoySpawn();
//     }

//     fireBullet(worldPos: Vec3) {
//         if (this.balance <= 0) return;

//         const bullet = this.bulletPool.size() > 0 ? this.bulletPool.get()! : instantiate(this.bulletPrefab);
//         bullet.setParent(this.gameArea);
//         bullet.setPosition(worldPos);
//         bullet.getComponent(Bullet)!.init(this);

//         this.balance--;
//         this.updateUI();
//     }

//     private scheduleRandomBoySpawn() {
//         this.scheduleOnce(() => {
//             this.spawnBoy();
//             this.scheduleRandomBoySpawn();
//         }, 1 + Math.random() * 1);
//     }

//     private spawnBoy() {
//         const boy = this.boyPool.size() > 0 ? this.boyPool.get()! : instantiate(this.boyPrefab);
//         boy.setParent(this.gameArea);

//         const areaW = this.gameArea.getComponent(UITransform)?.width ?? 1300;
//         const fromLeft = Math.random() > 0.5;
//         const startX = fromLeft ? -areaW / 2 - 60 : areaW / 2 + 60;
//         const y = (Math.random() * 300) - 150;

//         boy.setPosition(startX, y);
//         boy.getComponent(Boy)!.init(this, fromLeft);
//     }

//     recycleBullet(bullet: Node, hit = false) {
//         bullet.active = false;
//         this.bulletPool.put(bullet);
//         if (!hit) {
//             this.balance++;
//             this.updateUI();
//         }
//     }

//     recycleBoy(boy: Node) {
//         boy.active = false;
//         boy.setScale(1, 1, 1);
//         this.boyPool.put(boy);
//     }

//     addScore(points: number) {
//         this.balance += points;
//         this.updateUI();
//     }

//     private updateUI() {
//         const label = this.balanceLabel?.getComponent(Label);
//         if (label) label.string = `${this.balance}`;
//     }

//     getCoinEffect(): CoinEffect {
//         return this.coinEffect;
//     }
// }