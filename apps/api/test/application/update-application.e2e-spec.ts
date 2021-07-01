import { ApplicationModule } from '@api/modules/application/application.module';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { withNestAppE2eContext } from '@api-test-helpers/with-nest-app-e2e-context';
import { v4 } from 'uuid';

import { createRequestAgent } from '../helpers/createRequestAgent';

const appContext = withNestAppE2eContext({
  imports: [ApplicationModule],
});
describe('PATCH /v1/applications/:id', () => {
  it('404 if id not found', async () => {
    const app = appContext.app;

    const newConfig = {
      clientSecretKey: [v4()],
      origins: ['http://localhost:3000'],
      serverSecretKey: [v4()],
    };
    await createRequestAgent(app.getHttpServer())
      .patch(`/v1/applications/${v4()}`)
      .set('Authorization', signFakedToken(appContext.module))
      .send(newConfig)
      .expect(expectResponseCode({ expectedStatusCode: 404 }));
  });

  it('Update application', async () => {
    const app = appContext.app;
    const [createdApplication] = await createApplicationInDB(
      appContext.module,
      [applicationBuilder({ name: 'PATCH /v1/applications' })],
    );
    const newConfig = {
      clientSecretKey: [v4()],
      origins: ['http://localhost:3000'],
      serverSecretKey: [v4()],
    };
    const { body } = await createRequestAgent(app.getHttpServer())
      .patch(`/v1/applications/${createdApplication.id}`)
      .set('Authorization', signFakedToken(appContext.module))
      .send(newConfig)
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data).toStrictEqual({
      clientSecretKey: newConfig.clientSecretKey,
      id: createdApplication.id,
      name: createdApplication.name,
      origins: newConfig.origins,
      serverSecretKey: newConfig.serverSecretKey,
    });
  });
});
