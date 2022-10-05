import { calcGrow, calcHack, calcWeaken } from "../../batches/calculations"
import { ALL_SERVERS, TEST_HACKING_FORMULAS, TEST_PLAYER } from "../test-data"

const NOODLES = "n00dles";

describe("Calculations Tests", () => {
    describe("calcWeaken", () => {
        describe("when no action is needed", () => {
            it("should return default action stats values", () => {
                const weakenStats = calcGrow(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 0);

                expect(weakenStats.threadsRequired).toBe(0);
                expect(weakenStats.ramRequired).toBe(0);
                expect(weakenStats.timeForAction).toBe(100);
                expect(weakenStats.securityIncrease).toBe(0);
            });
        });

        describe("with default weaken factor", () => {
            it("should be successful", () => {
                const weakenStats = calcWeaken(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER);

                expect(weakenStats.threadsRequired).toBe(100);
                expect(weakenStats.ramRequired).toBe(175);
                expect(weakenStats.timeForAction).toBe(1100);
                expect(weakenStats.securityIncrease).toBe(0);
            });
        });

        describe("with precalculated weaken factor", () => {
            const weakenStats = calcWeaken(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 10);

            expect(weakenStats.threadsRequired).toBe(200);
            expect(weakenStats.ramRequired).toBe(350);
            expect(weakenStats.timeForAction).toBe(1100);
            expect(weakenStats.securityIncrease).toBe(0);
        });
    });

    describe("calcGrow", () => {
        describe("when no action is needed", () => {
            it("should return default action stats values", () => {
                const growStats = calcGrow(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 0);

                expect(growStats.threadsRequired).toBe(0);
                expect(growStats.ramRequired).toBe(0);
                expect(growStats.timeForAction).toBe(100);
                expect(growStats.securityIncrease).toBe(0);
            });
        });

        describe("with default growth factor", () => {
            it("should return expected values", () => {
                const growStats = calcGrow(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER);

                expect(growStats.threadsRequired).toBe(1206);
                expect(growStats.ramRequired).toBe(2111);
                expect(growStats.timeForAction).toBe(1100);
                expect(growStats.securityIncrease).toBe(4.824);
            });
        });

        describe("with precalculated growth factor", () => {
            it("should return expected values", () => {
                const growStats = calcGrow(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 5.43);

                expect(growStats.threadsRequired).toBe(5430);
                expect(growStats.ramRequired).toBe(9503);
                expect(growStats.timeForAction).toBe(1100);
                expect(growStats.securityIncrease).toBe(21.72);
            });
        });
    });

    describe("calcHack", () => {
        describe("when no action is needed", () => {
            it("should return default action stats values", () => {
                const hackStats = calcHack(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 0);

                expect(hackStats.threadsRequired).toBe(0);
                expect(hackStats.ramRequired).toBe(0);
                expect(hackStats.timeForAction).toBe(100);
                expect(hackStats.securityIncrease).toBe(0);
            });
        });

        describe("with default hack factor", () => {
            it("should return expected values", () => {
                const hackStats = calcHack(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER);

                expect(hackStats.threadsRequired).toBe(2);
                expect(hackStats.ramRequired).toBe(4);
                expect(hackStats.timeForAction).toBe(1100);
                expect(hackStats.securityIncrease).toBe(0.004);
            });
        });

        describe("with precalculated growth factor", () => {
            const hackStats = calcHack(TEST_HACKING_FORMULAS, ALL_SERVERS.get(NOODLES)!, TEST_PLAYER, 0.75);

            expect(hackStats.threadsRequired).toBe(3);
            expect(hackStats.ramRequired).toBe(6);
            expect(hackStats.timeForAction).toBe(1100);
            expect(hackStats.securityIncrease).toBe(0.006);
        });
    });
});