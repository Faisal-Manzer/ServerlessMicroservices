import {APIGatewayEvent, Context} from "aws-lambda";
import handlers from "../handlers";

test("say hello", async () => {
  const event = {} as APIGatewayEvent;
  const context = {} as Context;
  const response = await handlers.hello(event, context);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toBe("welcome");
});
