import Run from '../db/models/Run';
import Webhook from '../db/models/Webhook';
import WebhookEvent from './WebhookEvent';
import axios from 'axios';
import { getRepository } from 'typeorm';

type WebhookPayload<T extends WebhookEvent> = T extends WebhookEvent.NEW_RUN
    ? Run
    : never;

export async function webhookEvent<T extends WebhookEvent>(
    event: T,
    payload: WebhookPayload<T>
): Promise<{ event: T; payload: WebhookPayload<T> }> {
    const message = {
        event,
        payload,
    };

    const webhooks = await getRepository(Webhook)
        .createQueryBuilder('webhook')
        .where('webhook.events @> ARRAY[:event]', { event })
        .getMany();

    for (const webhook of webhooks) {
        axios
            .post(webhook.url, message)
            .then((data) => {
                // todo: good log
                console.log(data);
            })
            .catch((err) => {
                // todo: bad log
                console.log(err);
            });
    }

    return message;
}
