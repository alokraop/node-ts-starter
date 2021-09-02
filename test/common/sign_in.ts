import { SuperTest, Test } from "supertest";

const user = {
    email: 'sample@wherever.com',
    password: 'anythingElse'
};

export async function fetchUserToken(app: SuperTest<Test>): Promise<string> {
    const res = await app
      .post('/api/v1/auth/sign-in')
      .send(user);
    return res.body.token;
}