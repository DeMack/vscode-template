import { buildServerMap, scanAllTheThings, validateArgs } from '../../misc/utils'
import { ALL_SERVERS, SCANNED_HOSTS, TEST_NS } from '../test-data'

describe("Utils Tests", () => {
    describe("scanAllTheThings", () => {
        it("should build a map as expected", () => {
            const hosts = scanAllTheThings(TEST_NS, "home");
            expect(hosts).toBeTruthy();
            expect(hosts.size).toBe(97);
            expect(hosts).toMatchObject(SCANNED_HOSTS);
        });
    });

    describe("buildServerMap", () => {
        it("should build a map as expected", () => {
            const hosts = buildServerMap(TEST_NS, "home");
            expect(hosts).toBeTruthy();
            expect(hosts.size).toBe(97);
            expect(hosts).toMatchObject(ALL_SERVERS);
        });

        describe("when a filter is provided", () => {
            it("should provide a map without the filtered elements", () => {
                const hosts = [...buildServerMap(TEST_NS, "home", (hostname) => !hostname.startsWith("pserv")).keys()];
                expect(hosts).toBeTruthy();
                expect(hosts).toHaveLength(72);

                const filteredKeys = [...ALL_SERVERS.keys()].filter(([hostname]) => hostname.startsWith("pserv"));
                filteredKeys.forEach((hostname) => expect(hosts).not.toContain(hostname));
            });
        });
    });

    describe("validateArgs", () => {
        test("When length is invalid expect failure", () => {
            const [success, msg] = validateArgs([], 1, ["undefined"]);
            expect(success).toBeFalsy();
            expect(msg).toBe("Invalid args provided. Expected 1, but 0 provided.");
        });

        test("When arg type doesn't match expected Then expect failure", () => {
            const [success, msg] = validateArgs(["arg0"], 1, ["number"]);
            expect(success).toBeFalsy();
            expect(msg).toBe("Invalid args[0]:arg0 provided. Expected number but string was provided");
        });

        test("When custom validator is failed Then expect failure", () => {
            const [success, msg] = validateArgs([1], 1, ["number"], (args) => {
                if (args[0] === 1) return [false, "Task failed successfully"];
                else return [true, ""];
            });

            expect(success).toBeFalsy();
            expect(msg).toBe("Task failed successfully");
        });

        test("When all checks pass Then expect success", () => {
            const [success, msg] = validateArgs([1], 1, ["number"]);
            expect(success).toBeTruthy();
            expect(msg).toBe("");
        });
    });
});