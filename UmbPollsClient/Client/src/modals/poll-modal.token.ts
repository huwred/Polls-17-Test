import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export type PollModalData = {
    headline: string;
}

export type PollModalValue = {
    poll: {
        key: string,
        value: string
    };

}

export const POLL_MODAL_TOKEN = new UmbModalToken<PollModalData, PollModalValue>('Poll.Modal', {
    modal: {
        type: 'sidebar',
        size: 'small'
    }
});