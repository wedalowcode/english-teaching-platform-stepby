"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createUserAction } from "../actions";
import type { CreateUserState } from "../schemas";

const initialState: CreateUserState = {};

export function UserCreateForm() {
  const [state, action, pending] = useActionState(
    createUserAction,
    initialState
  );

  const nameError = state.fieldErrors?.name?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const usernameError = state.fieldErrors?.username?.[0];
  const phoneError = state.fieldErrors?.phone?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          姓名
        </label>

        <Input
          id="name"
          name="name"
          autoComplete="off"
          defaultValue={state.values?.name}
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "name-error" : undefined}
          required
        />

        {nameError && (
          <p id="name-error" className="text-sm text-destructive">
            {nameError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          defaultValue={state.values?.email}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          required
        />

        {emailError && (
          <p id="email-error" className="text-sm text-destructive">
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>

        <Input
          id="username"
          name="username"
          defaultValue={state.values?.username}
          aria-invalid={!!usernameError}
          aria-describedby={
            usernameError ? "username-error" : undefined
          }
          required
        />

        {usernameError && (
          <p id="username-error" className="text-sm text-destructive">
            {usernameError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          手机号
        </label>

        <Input
          id="phone"
          name="phone"
          defaultValue={state.values?.phone}
          aria-invalid={!!phoneError}
          aria-describedby={phoneError ? "phone-error" : undefined}
        />

        {phoneError && (
          <p id="phone-error" className="text-sm text-destructive">
            {phoneError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          初始密码
        </label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!passwordError}
          aria-describedby={
            passwordError ? "password-error" : undefined
          }
          required
        />

        {passwordError && (
          <p id="password-error" className="text-sm text-destructive">
            {passwordError}
          </p>
        )}
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "正在创建..." : "创建用户"}
      </Button>
    </form>
  );
}