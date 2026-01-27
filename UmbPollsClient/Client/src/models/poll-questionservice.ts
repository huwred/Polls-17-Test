import type { PollQuestion } from "./poll-question";

export class PollQuestionService {
    private static baseUrl: string = '/get-question';
    private static _headers: Headers = new Headers();

    // Add a static initialization block to set headers
    static {
        this._headers.set('Content-Type', 'application/json');
        this._headers.set('Accept', 'application/json');
    }

    public static async GetPolls(): Promise<PollQuestion[]> {

        let response = await fetch(`${this.baseUrl}/`, {
            method: 'GET',
            headers: this._headers
        })

        if (!response.ok)
            throw new Error('Network response was not ok');

        let polls: any[] = await response.json()

        if (!polls)
            throw new Error('Something went wrong parsing the response!');

        polls.forEach((p) => {
            let id = p.id; 

            if (id) {
                p.id = id;
            }
        });

        return polls;
    }
    public static async GetOverview(): Promise<any[]> {

        let response = await fetch(`/get-overview/`, {
            method: 'GET',
            headers: this._headers
        });
        if (!response.ok)
            throw new Error('Network response was not ok');

        let polls: any[] = await response.json()

        if (!polls)
            throw new Error('Something went wrong parsing the response!');

        polls.forEach((p) => {
            let id = p.id;

            if (id) {
                p.id = id;
            }
        });

        return polls;
    }
    public static async GetOverviewById(id: number): Promise<PollQuestion> {

        let response = await fetch(`/get-overview/?id=${id}`, {
            method: 'GET',
            headers: this._headers
        });

        if (!response.ok)
            throw new Error('Network response was not ok');
        console.log(response);

        let polls: any[] = await response.json()

        return polls[0];
    }

    public static async GetPollById(id: number): Promise<PollQuestion> {

        let response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'GET',
            headers: this._headers
        });

        if (!response.ok)
            throw new Error('Network response was not ok');

        let poll: any = await response.json();

        return poll;
    }
    public static async Delete(id: number): Promise<PollQuestion> {

        let response = await fetch('/delete-question/' + id, {
            method: 'DELETE',
            headers: this._headers
        })

        if (!response.ok)
            throw new Error('Network response was not ok');

        let poll: any = await response.json();

        return poll;
    }
    public static async DeleteResponses(id: number): Promise<PollQuestion> {

        let response = await fetch('/delete-responses/' + id, {
            method: 'DELETE',
            headers: this._headers
        })

        if (!response.ok)
            throw new Error('Network response was not ok');

        let poll: any = await response.json();

        return poll;
    }
}