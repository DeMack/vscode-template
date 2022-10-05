import { NetscriptPort, NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const maxPortCount = 20;
    const incomingTopic = "message-broker.internal.incoming";

    const topics: Map<string, NetscriptPort> = new Map();

    topics.set(incomingTopic, ns.getPortHandle(1));





    // TODO: new subscriber
    // TODO: new publisher
    // TODO: create topic
    // TODO: receive message
}