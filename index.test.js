const SnowplowHelper = require("./index.js");
const axios = require("axios");
const assert = require("assert");

const SnowplowMicroEndpoint = "http://localhost:1001";

const SnowplowAPI = {
  endpoint: SnowplowMicroEndpoint,
  good: `${SnowplowMicroEndpoint}/micro/good`,
  bad: `${SnowplowMicroEndpoint}/micro/bad`,
  reset: `${SnowplowMicroEndpoint}/micro/reset`,
  all: `${SnowplowMicroEndpoint}/micro/all`,
};

jest.mock("assert");
assert.fail = jest.fn();
assert.ok = jest.fn();

jest.mock("axios");

const setSnowplowMicroLogs = (events = []) =>
  axios.get.mockImplementation(() => Promise.resolve({ data: events }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CodeceptJS helper", () => {
  it("knows how to interact with Snowplow", () => {
    const helper = new SnowplowHelper({
      endpoint: SnowplowAPI.endpoint,
    });

    expect(helper.config).toEqual(SnowplowAPI);
  });
});

describe("I.dontSeeBadEvents", () => {
  it("does not spot bad events when there are none", async () => {
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs([]);
    await helper.dontSeeBadEvents();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.bad);
    expect(assert.fail).toHaveBeenCalledTimes(0);
    expect(assert.ok).toHaveBeenCalledTimes(1);
  });

  it("throws an error when it finds bad events", async () => {
    const badEvents = [1, 2, 3];
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs(badEvents);
    await helper.dontSeeBadEvents();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.bad);
    expect(assert.ok).toHaveBeenCalledTimes(0);
    expect(assert.fail).toHaveBeenCalledTimes(1);
    expect(assert.fail).toHaveBeenCalledWith(
      `There are ${badEvents.length} bad events`
    );
  });
});

describe("I.seeGoodEvents( quantity )", () => {
  it("checks if there is a precise number of good events", async () => {
    const goodEvents = [1, 2, 3];
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs(goodEvents);
    await helper.seeGoodEvents(goodEvents.length);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.good);
    expect(assert.ok).toHaveBeenCalledTimes(1);
    expect(assert.fail).toHaveBeenCalledTimes(0);
  });

  it("throws an error when there number of good events is unexpected", async () => {
    const goodEvents = [1, 2, 3];
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs(goodEvents);
    await helper.seeGoodEvents(goodEvents.length - 1);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.good);
    expect(assert.ok).toHaveBeenCalledTimes(0);
    expect(assert.fail).toHaveBeenCalledTimes(1);
    expect(assert.fail).toHaveBeenCalledWith(
      `There are ${goodEvents.length} good events, but ${goodEvents.length - 1}`
    );
  });
});

describe("I.seeTotalNumberOfEvents( quantity )", () => {
  it("checks if the number of logged events matches the expectations", async () => {
    const totalEvents = { total: 1, good: 1, bad: 0 };
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs(totalEvents);
    await helper.seeTotalNumberOfEvents(totalEvents.total);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.all);
    expect(assert.ok).toHaveBeenCalledTimes(1);
    expect(assert.fail).toHaveBeenCalledTimes(0);
  });

  it("throws an error when the total number of events logged does not match the expectations", async () => {
    const totalEvents = { total: 1, good: 1, bad: 0 };
    const helper = new SnowplowHelper(SnowplowAPI);
    setSnowplowMicroLogs(totalEvents);
    await helper.seeTotalNumberOfEvents(totalEvents.total + 1);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(SnowplowAPI.all);
    expect(assert.ok).toHaveBeenCalledTimes(0);
    expect(assert.fail).toHaveBeenCalledTimes(1);
    expect(assert.fail).toHaveBeenCalledWith(
      `There are ${totalEvents.total} events, not ${totalEvents.total + 1}`
    );
  });
});

describe("I.resetAllEvents", () => {
  it("resets all event logs", async () => {
    const helper = new SnowplowHelper(SnowplowAPI);
    await helper.resetAllEvents();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
