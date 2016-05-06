import AnimatedTimer from '../src/animated-timer';

describe('AnimatedTimer', function() {

  class FakeAgent {
    frame() {
      return new Promise(requestAnimationFrame);
    }

    timer(fn) {
      const timer = new AnimatedTimer(this);
      return timer._init(fn);
    }
  }

  function itWillJoin(name, fn) {
    const wrapper = function() {
      const timer = fn();
    };
    wrapper.toString = function() {return fn.toString();}
    it(`will join ${name}`, wrapper);
  }

  // function itThrows(name, fn) {
  //   const wrapper = function() {
  //     const timer = fn();
  //   };
  //   wrapper.toString = function() {return fn.toString();}
  //   it(`${name} errors once canceld`, wrapper);
  // }

  let agent;

  beforeEach(function() {
    agent = new FakeAgent();
  });

  it('creates a timer', function() {
    const timer = agent.timer();
  });

  it('can be canceled', function() {
    const timer = agent.timer();
    expect(timer.cancel).to.be.a('function');
    timer.cancel();
    return timer.then().catch(error => {
      expect(error.message).to.equal('Timer canceled');
    });
  });

  it('returns a value from the cancel handler', function() {
    const timer = agent.timer();
    timer.cancelable(() => 1);
    expect(timer.cancel()).to.equal(1);
    return timer.then().catch(error => {
      expect(error.message).to.equal('Timer canceled');
    });
  });

  it('can be reinitialized after being canceled', function() {
    const timer = agent.timer();
    timer.cancel();
    const promise = timer.then().catch(error => {
      expect(error.message).to.equal('Timer canceled');
    });
    timer._init();
    return promise;
  });

  it('waits until next animation frame', function() {
    const timer = agent.timer();
    return timer.frame();
  });

  it('joins after the last frame', function() {
    const timer = agent.timer();
    let frameResolved = 0;
    timer.frame()
    .then(() => {frameResolved = 1; return timer.frame();})
    .then(() => {frameResolved = 2; return timer.frame();})
    .then(() => {frameResolved = 3;});
    return timer
    .then(() => {
      expect(frameResolved).to.equal(3);
    });
  });

  it('throws after being fulfilled instead of waiting for frame');

  it('throws when canceled while waiting for frame');

  it('times out for a given number of milliseconds');

  it('joins after the last timeout');

  it('throws after being fulfilled instead of waiting for timeout');

  it('throws when canceled while waiting for timeout');

  it('loops until the loop handler returns 1');

  it('joins after the last loop');

  it('throws after being fulfilled instead of starting a loop');

  it('throws when canceled while waiting for loop');

});
