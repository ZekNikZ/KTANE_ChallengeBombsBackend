import DiscordOauth2 from 'discord-oauth2';
import { randomBytes } from 'crypto';

const oauth = new DiscordOauth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URL,
});

const scope = ['identify', 'email'];

export function getOauthURL(): string {
    return oauth.generateAuthUrl({
        scope,
        state: randomBytes(16).toString('hex'),
    });
}

export async function getAccessToken(code: string): Promise<string> {
    return (
        await oauth.tokenRequest({
            code,
            scope,
            grantType: 'authorization_code',
        })
    )?.access_token;
}

export async function getDiscordId(
    accessToken: string
): Promise<{
    id: string;
    username: string;
    avatar: string | null | undefined;
}> {
    const { id, username, discriminator, avatar } = await oauth.getUser(
        accessToken
    );
    return { id, username: `${username}#${discriminator}`, avatar };
}
