import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

interface EntryDetails {
    media_type: string;
    graded: boolean;
    criteria_graded: boolean;
    media_data: {
        title: string;
        director: string;
        release_year: number;
        genres: string[];
        top_billed_actors: string[];
        short_description: string;
        criteria_grades?: {
            rewatchability: number;
            casting: number;
            attention_holding: number;
            effects: number;
            cinematography: number;
            suspension_of_disbelief: number;
            dialogue: number;
            pacing: number;
            soundtrack: number;
            plot: number;
            character_development: number;
        };
        overall_grade?: number;
        quotes?: string[];
        notes?: string;
    };
}



export const handler: APIGatewayProxyHandler = async (event) => {
    const { media_type, graded, criteria_graded, mediaData } = JSON.parse(event.body || '{}');

    if (!media_type || !graded || !criteria_graded || !mediaData) {
        return {
            statusCode: 400,
            body: 'Missing required parameters',
        };
    }

    if (!mediaData.title || !mediaData.release_year ) {
        return {
            statusCode: 400,
            body: 'Missing required media details',
        };
    }

    const cleanTitle = title.replace(/\s/g, '_');
    const cleanDirector = director.replace(/\s/g, '_');


    // Check if the year is a 4-character number
    if (!/^\d{4}$/.test(year)) {
        return {
            statusCode: 400,
            body: 'Invalid year format. Year must be a 4-character number.',
        };
    }

    const titleYear = `${cleanTitle}-(${year})`;

    try {
        await dynamodb.put({
            TableName: process.env.TABLE_NAME!,
            Item: {
                mediaId: titleYear,
                mediaType: 'MOVIE',
                userId,
                cleanTitle,
                year,
                cleanDirector,
                status,
            },
        }).promise();
        return {
            statusCode: 200,
            body: 'Movie details saved successfully',
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: 'Error saving movie details',
        };
    }
};
