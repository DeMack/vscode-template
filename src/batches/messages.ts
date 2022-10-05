import { randomUUID } from 'crypto';

type Header = [string, string]

export default class Message<T> {
    id: string;
    header: Header;
    sourceHost: string;
    body: T;

    constructor(header: Header, sourceHost: string, body: T, id = randomUUID()) {
        this.sourceHost = sourceHost;
        this.header = header;
        this.body = body;
        this.id = id;
    }
}
