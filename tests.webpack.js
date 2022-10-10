const chai = require('chai');
const chaiSinon = require('sinon-chai');

chai.use(chaiSinon);

const context = require.context('./src/', true, /.spec\.[jt]sx?$/);
context.keys().forEach(context);
