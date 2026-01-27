import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import type { PollQuestion } from "../models/poll-question.js";

export type PollModalData = {
    headline: string;
}

export type PollModalValue = {
    poll: PollQuestion;

}

export const POLL_MODAL_TOKEN = new UmbModalToken<PollModalData, PollModalValue>('Poll.Modal', {
    modal: {
        type: 'sidebar',
        size: 'small'
    }
});