import cluster from 'node:cluster';
import * as os from 'node:os';
import * as process from 'node:process';

import { Injectable, Logger } from '@nestjs/common';

const numCPUs = os.cpus().length;

interface CallbackFunction {
  (): Promise<void> | void;
}

@Injectable()
export class MainService {
  static clusterize(callback: CallbackFunction): void {
    const logger = new Logger(MainService.name);
    if (cluster.isPrimary) {
      logger.verbose(`Master Server is running in process ${process.pid}`);
      logger.verbose(`Cluster size: ${numCPUs}`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        logger.verbose(`Worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
