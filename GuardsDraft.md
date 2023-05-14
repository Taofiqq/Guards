# Understanding Guards in NestJS

### Introduction

NestJS is a powerful framework for building efficient, scalable Node.js server-side applications [Reference](https://docs.nestjs.com/). Guards are one of the important features of NestJS as they allow you to enforce various types of authorization and authentication in your application. They allow you to set up and enforce specific rules to limit users that can access certain routes in the application. With guard implementation, you can be sure that only authorized users are able to access routes that cannot be publicly accessed. This helps to prevent unauthorized user access and also protects against potential attacks such as data breaches.

In this tutorial, you will take a deep dive into understanding what Guards are, how they work and how you can use them effectively in your application. First, you will be implementing an `AuthGuard` and understanding how it works in protecting endpoints from unauthorized access.
Secondly, you will explore how to bind guards at different scoped levels (**global, controller and method level**) which will allow you to implement granular authentication checks. Next, you will learn how to use multiple guards and skipping of authentication checks for specific endpoints to make them publicly accessible without the need for authorization.

At the end of this guide, you will have a thorough understanding of how to implement Guards in NestJS applications effectively and building secured and scalable applications that are protected from unauthorized access.

## Prerequisites

To follow this tutorial, you will need:

- To install Node.js (version >= 12) on your operating system. You can follow [ How to Install Node.js and Create a Local Development Environment](https://www.digitalocean.com/community/tutorial_series/how-to-install-node-js-and-create-a-local-development-environment).
- A Code Editor and API Testing Tool like [VSCode](https://code.visualstudio.com/) and [PostMan](https://www.postman.com/) Respectively.
- To be familiarized with NestJS basics. See [Getting Started with NestJS](https://www.digitalocean.com/community/tutorials/getting-started-with-nestjs).

## Step 1 - Installing NestJS and Setting up Project Directory

The name of the project folder that will be created will be called `guard`. The NestJS application will be bootstrapped from the [Nest CLI](https://docs.nestjs.com/cli/overview) using the command:

```command
nest new guard
```

This will bootstrap the NestJS application and provide the necessary files that are needed for the implementation of guards in NestJS. You will see the following output in your CLI once your application has been created:

```command
🚀  Successfully created project guard
👉  Get started with the following commands:
$ cd guard
$ yarn run start
```

Once the installation is complete, change your directory to the new directory folder(**guard**) that you have just created using the command

```command
cd guard
```

Then start the application with:

```command
yarn start:dev
```

This will start the development server at port 3000, and you will see an output like below in your terminal:

```command
File change detected. Starting incremental compilation...

 Found 0 errors. Watching for file changes.

[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [NestFactory] Starting Nest application...
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [InstanceLoader] AppModule dependencies initialized +34ms
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [RoutesResolver] AppController {/}: +5ms
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [RouterExplorer] Mapped {/, GET} route +4ms
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [RouterExplorer] Mapped {/test, GET} route +0ms
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [RouterExplorer] Mapped {/public, GET} route +1ms
[Nest] 48025  - 05/14/2023, 9:13:33 AM     LOG [NestApplication] Nest application successfully started +4ms
```

Once the application is up and running at port `3000`, go to your browser and enter the URL `http:localhost:3000` and you'll see the page successfully loaded as shown below:

![Screenshot of the localhost:3000 which serve as the root server port displaying the text "Hello World", indicating that the app is up and running](https://imgur.com/a/h3ywWdo “Server Port Page”)

After the bootstrapping of the project, open the project folder in your favourite code editor and create a new folder under the `src` folder called `guards` then, create a file inside the guards folder called `auth.guard.ts`. The implementation of the `AuthGuard` will be done inside this `auth.guard.ts` file.

![Screenshot of the Project's folder structure showing three folders: **dist,node_modules and guards**, with a subfolder: **guards** and a typescript file: **auth.guard.ts**](https://imgur.com/a/bVSQEAc “Folder Structure”)

Next, you will create an `AuthGuard` that will protect the routes in the application.

## Step 2 - Implementation of Authentication Guard

To start the auth guard implementation, the `canActivate` interface will be implemented. Every guard created in NestJS must implement the `canActivate` function. The `canActivate` function usually returns a boolean, i.e. it specifies if the current request being sent by the user to an endpoint should go through or not. The returned boolean value (whether `true` or `false`) is what NestJS uses to control the next action i.e:

- if the return value is **false**, the request will be denied and an unauthorized error will be thrown
- if the return value is **true**, the request will be processed and the user have access to the endpoint.

The below code block shows the implementation of the `AuthGuard` in the `auth.guard.ts` file created earlier:

```javascript
[label / src / guards / auth.guard.ts];

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers;
    if (apiKey && apiKey.api_key === 'MY_API_KEY') {
      return true;
    }
    return false;
  }
}
```

Here is a simple `AuthGuard` that implements an authorization guard which allows the request to a route handler or endpoint to be processed, if the user has a valid `api_key`. The `ExecutionContext` interface has access to the request object through the `switchToHttp().getRequest()` method. The headers needed to perform the guard authentication can be accessed from this request object. The request object is retrieved from the context params, and then a variable named `apiKey` is used to store the `request.headers` value which the user is passing when making the request. If the `apiKey` value is present in the request headers, and it is equal to `MY_API_KEY`, which represents the secret `api_key` value to access that route, the request should proceed, if the user inputs another value apart from our secret `api_key` the request should not be processed and an unauthorized error should be thrown as explained earlier.

To make the guard protect the routes in the `app.controller.ts `file, import the `AuthGuard` function and bind it to the scope of the controller using the `@UseGuards` decorator as shown below:

```javascript
[label /src/app.controller.ts]

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return 'This is a Test Route';
  }
}
```

Let's test this out by making the request in PostMan:

![Screenshot of a PostMan Interface showing the testing of the AuthGuard Implementation. It shows a Forbidden resource error because the api_key passed is wrong and the request was not processed](https://imgur.com/a/H6pR3NS “Testing AuthGuard on PostMan”)

![Screenshot of a PostMan Interface showing the testing of the AuthGuard Implementation. It shows a 200 success message because the api_key passed is correct and the request is processed successfully](https://imgur.com/a/KMTgMwh “Testing AuthGuard on PostMan”)

In the first image, the request is made to the endpoint `localhost:3000` which is expected to return a string: `Hello World`. The `api_key` passed in the headers has a value of `MY_API`. When the request is sent, a 403 Forbidden Error is thrown. This is because the `AuthGuard` have a return value of `false`, since the value passed (`MY_API`) does not match the correct `apiKey` value we specify in the guard. For the second image, the correct `api_key` was passed in the request headers with the correct apiKey value (`MY_API_KEY`) and the request went through with a response of `Hello Guards` returned. This implies that only users with the secret key - `MY_API_KEY` can access the routes in this controller file of the application.

Next, you will explore the ways of binding guards.

## Step 3 - Binding of Guards

What does the binding of guards mean? Basically, when we created the `AuthGuard` function in the previous step, the guard is standalone and cannot protect any routes unless we bind it at the global level using the `useGlobalGuards` method or to the controller or method level using the `UseGuards` decorator

Just like `interceptors`, `pipes` and `exception filters`, guards can be global-scoped, controller-scoped or method-scoped.

The `@UseGlobalGuards` method is used to bind guards globally and the `AuthGuard` can be bound globally in the `main.ts` file as shown below:

```javascript
[label / src / main.ts];

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
```

Here, the `AuthGuard` is bound at the global level using the `useGlobalGuards()` method of the Nest application instance. If we go to any route in the application and pass in the wrong `api_key` value, a forbidden resource error for unauthorized access will be thrown, if the right `api_key` is passed to the request headers, it will return a 200 success message and the endpoint will be accessed successfully.

For `controller-scoped` guard binding, the `@UseGuards` decorator will be applied under the `Controller` decorator to guard all the routes in that particular controller only as shown below:

```javascript
[label /src/app.controller.ts]
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return 'This is a Test Route';
  }
}
```

The above piece of code infers that the `AuthGuard` will be applied to the two routes in the `app.contorller.ts` file.

The binding guard at the method level is similar to the controller-level binding, the `@UseGuards` decorator is used to guard a **specific** route in this case as shown below:

```javascript
[label /src/app.controller.ts]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(AuthGuard)
  test(): string {
    return 'This is a Test Route';
  }
}
```

In this case only the route **/test** will be guarded by the AuthGuard, while the other route **Get()** will be publicly accessed as shown in the image below:

![Screenshot of a PostMan Interface showing the testing of the AuthGuard bound at method level. The AuthGuard was not used on the root endpoint **localhost:3000**, hence the route was able to be accessed](https://imgur.com/a/bOntH5O “Testing Guard Binding on PostMan Interface”)

![Screenshot of a PostMan Interface showing the testing of the AuthGuard bound at method level. The AuthGuard was used on the **localhost:3000/test** endpoint, hence the route was not able to be accessed](https://imgur.com/a/6PJUBIj “Testing Guard Binding on PostMan Interface”)

Next is understanding how multiple guards can be used in NestJS.

## Step 4 - Using Multiple Guards

NestJS allows us to apply more than one guard at a time, either at the `controller` or `method` level, and these guards will be executed in the order in which they are bound. Let's create a new file in the `guards` folder called `business.guard.ts` and create a guard that prevents users from accessing routes if they do not have a businessID.

```javascript
[label / src / guards / business.guard.ts];

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BusinessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const businessID = request.headers['business_id'];
    if (businessID && businessID === '892367480') {
      return true;
    }
    return false;
  }
}
```

The `BusinessGuard` function implements the `canActivate` method which is used to extract the `business_id` in the request header from the request object using the `getRequest` method of the context object. As mentioned earlier, this guard checks whether the `business_id `exist in the header of the request and if the value passed by the user matches the predefined `business_id` value (**892367480**). If the business_id key is not passed or the value passed does not match the predefined value, the guard returns false, indicating that access to the route should be denied, otherwise it returns true, which means that access should be allowed.

Now, let's bind the `BusinessGuard` and the `AuthGuard` on the '**/test**' route.

```javascript
[label /src/app.controller.ts]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(AuthGuard, BusinessGuard)
  test(): string {
    return 'This is a Test Route';
  }
}
```

When a request is being made to the **/test** route, the `AuthGuard` is called first to ensure the conditions specified in the `AuthGuard` is good for the request to be processed, if it returns true (**i.e api_key is passed in the request header**), then `BusinessGuard` will then be applied. This is demonstrated below:

![Screenshot of a PostMan Interface showing how multiple guards work. The AuthGuard was used on the **localhost:3000/test** endpoint, but an unauthorized error was thrown because it has not met the condition for the BusienssGuard](https://imgur.com/a/xrhExaB “Testing Multiple Guards on PostMan Interface”)

![Screenshot of a PostMan Interface showing how multiple guards work. The AuthGuard and BusinessGuard was used on the **localhost:3000/test** endpoint, both **api_key and business_id value was passed and a successful response was returned**](https://imgur.com/a/5GWJwUc “Testing Multiple Guards on PostMan Interface”)

In the first image, only the api_key was passed, hence the unauthorized access error, while in the second image, both the `api_key` and `business_id` was passed passing the multiple guards that were specified for the **'/test'** route.

Next is implementing Authorization Check Skipping for specific endpoints.

## Step 5 - Skipping Authorization Checks

When developing a NestJS application and implementing guards for endpoint authorization, you may have a controller that uses a guard on all routes, but there may be a specific endpoint where you want to omit authorization and make it publicly accessible while the others are being protected by the guard.

To achieve this, a `metadata` that provides extra information and context which will be added to the guard instance. Create an `auth.metadata.decorator` file in the `src` directory. The metadata will be set with the key - **authorized** for the endpoint that will be skipped.

```javascript
[label / src / auth.metadata.decorator.ts];

import { SetMetadata } from '@nestjs/common';

export const AuthMetaData = (...metadata: string[]) =>
  SetMetadata('authorized', metadata);
```

In the piece of code above, there is an `AuthMetaData` function that calls the `SetMetaData` decorator which takes in two arguments, the `authorized` string and the metadata array which was passed in as an argument in the `AuthMetaData` function

Then, the `auth.guard.ts` file will be modified to check if any authorization metadata is being set to any controller or method that is being guarded before processing the request.

```javascript
[label /src/guards/auth.guard.ts]

 const authMetaData = this.reflector.getAllAndOverride<string[]>(
      'authorized',
      [context.getHandler(), context.getClass()],
    );

    if (authMetaData?.includes('SkipAuthorizationCheck')) {
      return true;
    }
```

Here, the `reflector` and the `getAllAndOverride` function are used to get the metadata that was set in the `AuthMetaData` decorator. The method takes two arguments, first one is the metadata key needed to be retrieved (**authorized**) and then, an array of objects the getAllAndOverride function will look at to get the metadata.

Inside the `getAllAndOverride` method, the handler and class of the current execution context are being passed, so that when the method runs, it checks for the metadata with the key "authorized" associated with the current handler. Then a check is made that, if the `authMetaData` retrieved includes the string `SkipAuthorizationCheck` then the authorization should be skipped for that route.

Now, in the `app.controller.ts` file, create a new route called `public`, the guard will be bound at the controller-level, while the `AuthMetaData` decorator will be used to skip the authorization guard/check with the metadata string for the `public` route only.

```javascript
[label /src/app.controller..ts]

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return 'This is a Test Route';
  }

  @Get('public')
  @AuthMetaData('SkipAuthorizationCheck')
  getPublic(): string {
    return 'public';
  }
}
```

Let's test this out:

![Screenshot of a PostMan Interface showing how to skip guard check in NestJS. The AuthGuard was used at the controller level, but the last route in the app controller was skipped. This root endpoint **localhost:3000** returns a unauthorized error as no api_key was passed](https://imgur.com/a/75hVsfY “Testing Authentication Skipping on PostMan Interface”)

![Screenshot of a PostMan Interface showing how to skip guard check in NestJS. The AuthGuard was used at the controller level, but the last route in the app controller was skipped. This **localhost:3000/test** returns a unauthorized error as no api_key was passed](https://imgur.com/a/Exu3zXc “Testing Authentication Skipping on PostMan Interface”)

![Screenshot of a PostMan Interface showing how to skip guard check in NestJS. The AuthGuard was used at the controller level, but the last route in the app controller was skipped. This **localhost:3000/public** returns a a successful response even when api_key was not passed](https://imgur.com/a/cfZcJRQ “Testing Authentication Skipping on PostMan Interface”)

In the first image, a request is being made to the **/** endpoint and an unauthorized error was thrown, for the second image, the request was made to the **/test** route, and the same error was thrown. In the last image where the request is being made to the **/public** endpoint, a 200 success response was returned, which shows that the AuthGuard has been bypassed for this route only using the AuthMetada decorator.

<$>[note]
**Note:** All the examples used in this guide are basic examples for you to understand the fundamentals of guards in NestJS. In your real-world applications, the guard may vary from basic to complex, depending on the application you are building and you will also need to store sensitive information in an env file (such as the **api keys**) so it is not being made available to the public.
<$>

## Conclusion

In this article, you took a deep dive into understanding what Guards are in NestJS, how to create an Authentication guard, binding of guards, using multiple guards in the NestJS application and Skipping Guard checks.

From here, you can learn how to create Role-Based Access Control Authorization as well as learn about Authentication in NestJS.

You will find the complete source code of this tutorial here on [GitHub](https://github.com/Taofiqq/Guards).

<$>[draft]
**For Editor:** The Github repository consists of 4 branches. A **master** branch and one branch for each step starting from Steps 2-5. Switch in between branches for code testing. Thank you. 
<$>
