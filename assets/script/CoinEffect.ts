// CoinEffect.ts
import { _decorator, Component, Node, Vec3, tween, UITransform, Label, Color, Sprite, SpriteFrame, resources, instantiate } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CoinEffect')
export class CoinEffect extends Component {
    private gameManager!: GameManager;

    init(gameManager: GameManager) { 
        this.gameManager = gameManager; 
    }

    createCoinFlyEffect(startPos: Vec3, coinCount = 3, reward: number) {
        const targetNode = this.gameManager.balanceLabel;
        if (!targetNode) { 
            this.gameManager.addScore(reward); 
            return; 
        }

        const targetPos = targetNode.getWorldPosition();
        const areaPos = this.gameManager.gameArea.getWorldPosition();
        const relativeTarget = new Vec3(
            targetPos.x - areaPos.x, 
            targetPos.y - areaPos.y, 
            0
        );

        for (let i = 0; i < coinCount; i++) {
            this.scheduleOnce(() => {
                this.createSingleCoin(startPos, relativeTarget, reward, i === coinCount - 1);
            }, i * 0.15);
        }
    }

    private createSingleCoin(startPos: Vec3, targetPos: Vec3, reward: number, isLast: boolean) {
        const coinPrefab = this.gameManager.getCoinPrefab();
        const coinNode = instantiate(coinPrefab);
        
        const label = coinNode.getComponentInChildren(Label);
        if (label) {
            label.string = `${reward}`;
        }

        coinNode.setParent(this.gameManager.gameArea);
        coinNode.setPosition(startPos);
        coinNode.setScale(0.4, 0.4, 1);

        const midPos = new Vec3(
            startPos.x + (Math.random() - 0.5) * 80,
            startPos.y + 150 + (Math.random() - 0.5) * 80,
            0
        );

        const rewardText = label?.node;

        tween(coinNode)
            .to(0.6, { position: midPos, scale: new Vec3(0.7, 0.7, 0.7) }, { easing: 'quadOut' })
            .delay(3.0)
            .to(0.75, { position: targetPos, scale: new Vec3(0.3, 0.3, 0.3) }, { easing: 'quadIn' })
            .call(() => {
                coinNode.destroy();
                if (isLast) this.gameManager.addScore(reward);
            })
            .start();

        if (rewardText) {
            tween(rewardText)
                .to(0.25, { scale: new Vec3(1.2, 1.2, 1.2) })
                .delay(3.0)
                .to(0.25, { scale: Vec3.ONE })
                .delay(0.6)
                .to(0.3, { scale: new Vec3(0.5, 0.5, 0.5) })
                .start();
        }

        if (label) {
            tween(label)
                .delay(3.0)
                .to(0.5, { color: new Color(255, 200, 0, 0) })
                .start();
        }
    }
}



// // CoinEffect.ts
// import { _decorator, Component, Node, Vec3, tween, UITransform, Label, Color, Sprite, SpriteFrame, resources } from 'cc';
// import { GameManager } from './GameManager';
// const { ccclass, property } = _decorator;

// @ccclass('CoinEffect')
// export class CoinEffect extends Component {
//     @property(SpriteFrame)
//     coinSprite: SpriteFrame = null!;
//     private gameManager!: GameManager;

//     init(gameManager: GameManager) { 
//         this.gameManager = gameManager; 
//     }

//     createCoinFlyEffect(startPos: Vec3, coinCount = 3, reward: number) {
//         const targetNode = this.gameManager.balanceLabel;
//         if (!targetNode) { 
//             this.gameManager.addScore(reward); 
//             return; 
//         }

//         const targetPos = targetNode.getWorldPosition();
//         const areaPos = this.gameManager.gameArea.getWorldPosition();
//         const relativeTarget = new Vec3(
//             targetPos.x - areaPos.x, 
//             targetPos.y - areaPos.y, 
//             0
//         );

//         for (let i = 0; i < coinCount; i++) {
//             this.scheduleOnce(() => {
//                 this.createSingleCoin(startPos, relativeTarget, reward, i === coinCount - 1);
//             }, i * 0.15);
//         }
//     }

//     private createSingleCoin(startPos: Vec3, targetPos: Vec3, reward: number, isLast: boolean) {
//         const coinNode = new Node('Coin');
        
//         const ui = coinNode.addComponent(UITransform);
//         ui.setContentSize(24, 24);
//         const sprite = coinNode.addComponent(Sprite);
        
//         if (this.coinSprite) {
//             sprite.spriteFrame = this.coinSprite;
//         } else {
//             resources.load("textures/goldcoin/spriteFrame", SpriteFrame, (err, spf) => {
//                 if (!err && spf) sprite.spriteFrame = spf;
//             });
//         }

//         const rewardText = new Node('RewardText');
//         rewardText.addComponent(UITransform);
//         const label = rewardText.addComponent(Label);
//         Object.assign(label, {
//             string: `+${reward}`,
//             fontSize: 60,
//             color: new Color(255, 215, 0, 255)
//         });
//         rewardText.setParent(coinNode);
//         rewardText.setPosition(90, 0, 0);

//         coinNode.setParent(this.gameManager.gameArea);
//         coinNode.setPosition(startPos);
//         coinNode.setScale(0.4, 0.4, 1);

//         const midPos = new Vec3(
//             startPos.x + (Math.random() - 0.5) * 80,
//             startPos.y + 150 + (Math.random() - 0.5) * 80,
//             0
//         );

//         tween(coinNode)
//             .to(0.6, { position: midPos, scale: new Vec3(0.7, 0.7, 0.7) }, { easing: 'quadOut' })
//             .delay(3.0)
//             .to(0.75, { position: targetPos, scale: new Vec3(0.3, 0.3, 0.3) }, { easing: 'quadIn' })
//             .call(() => {
//                 coinNode.destroy();
//                 if (isLast) this.gameManager.addScore(reward);
//             })
//             .start();

//         tween(rewardText)
//             .to(0.25, { scale: new Vec3(1.2, 1.2, 1.2) })
//             .delay(3.0)
//             .to(0.25, { scale: Vec3.ONE })
//             .delay(0.6)
//             .to(0.3, { scale: new Vec3(0.5, 0.5, 0.5) })
//             .start();

//         tween(label)
//             .delay(3.0)
//             .to(0.5, { color: new Color(255, 200, 0, 0) })
//             .start();
//     }
// }