import type { PollQuestion } from "./poll-question";
import type { PollDetail } from "./pollDetail";

export class PolQuestionService {
    private static baseUrl: string = '/get-question';

    public static async GetPolls(): Promise<PollQuestion[]> {
        let response = await fetch(`${this.baseUrl}/`);
        console.log(response)
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

    public static async GetPollById(id: number): Promise<PollDetail> {
        let response = await fetch(`${this.baseUrl}/${id}`);

        if (!response.ok)
            throw new Error('Network response was not ok');

        let poll: PollDetail = await response.json();

        return poll;
    }
}