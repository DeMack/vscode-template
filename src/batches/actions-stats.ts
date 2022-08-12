export default class ActionStats {
    threadsRequired: number;
    ramRequired: number;
    timeForAction: number;
    securityIncrease: number;

    constructor(threadsRequired: number, ramRequired: number, timeForAction: number, securityIncrease = 0) {
        this.threadsRequired = threadsRequired;
        this.ramRequired = ramRequired;
        this.timeForAction = timeForAction + 100;
        this.securityIncrease = securityIncrease;
    }
}
