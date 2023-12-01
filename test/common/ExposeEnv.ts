import * as path from 'path';

import * as dotenv from 'dotenv';

const envPath: string = path.resolve(__dirname, '../../.env.testing');

dotenv.config({ path: envPath });
