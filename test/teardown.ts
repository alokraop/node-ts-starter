import 'reflect-metadata';
import Container from 'typedi';
import { closeDb } from '../src/data/base';
import { AccountDao } from '../src/data/accounts';

const teardown = async () => {
  const aDao = Container.get(AccountDao);

  await Promise.all([aDao.deleteAll({})]);
  return closeDb();
};

export default teardown;
