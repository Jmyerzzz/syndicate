'use client'

import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface formValues {
  name: string,
  username: string,
  password: string
}

const UserForm = (props: {title: string, action: string}) => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: formValues = {
    name: '',
    username: '',
    password: '',
  };

  const handleSubmit = async (values: any, actions: any) => {
    let name, username, password, formData;
    if (props.title === "Sign Up") {
      ({name, username, password} = values);
      formData = {name, username, password};
    } else {
      ({username, password} = values);
      formData = {username, password};
    }
    fetch(props.action, {
      method: "POST",
      body: JSON.stringify(formData),
      redirect: "manual"
    })
    .then(res => {
      if (res.status === 400) {
        res.json().then(resp => setError(resp.error))
      }

      if (res.status === 0) {
        // redirected
        // when using `redirect: "manual"`, response status 0 is returned
        return router.refresh();
      }
  
      actions.setSubmitting(false);
    })
  }

  return (
    <div className="flex flex-grow items-center justify-center bg-black mb-20">
      <div className="bg-white p-8 rounded w-80">
        <h2 className="text-2xl text-gray-600 font-bold mb-4">{props.title}</h2>
        <Formik initialValues={initialValues} onSubmit={(values, actions) => handleSubmit(values, actions)}>
          {({ isSubmitting }) => (
            <Form>
              {props.title === "Sign Up" &&
                <div className="mb-4 text-gray-500">
                  <label htmlFor="name" className="block font-medium">
                    Name
                  </label>
                  <Field
                    type="name"
                    id="name"
                    name="name"
                    className="form-input w-full mt-1 px-1 text-gray-600 border border-solid border-gray-600 rounded"
                  />
                  {error && error.toLowerCase().includes("name required") &&
                  <div className="text-red-500">{error}</div>
                }
                </div>
              }

              <div className="mb-4 text-gray-500">
                <label htmlFor="username" className="block font-medium">
                  Username
                </label>
                <Field
                  type="username"
                  id="username"
                  name="username"
                  className="form-input w-full mt-1 px-1 text-gray-600 border border-solid border-gray-600 rounded"
                />
                {error && error.toLowerCase().includes("username") &&
                  <div className="text-red-500">{error}</div>
                }
              </div>

              <div className="mb-4 text-gray-500">
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-input w-full mt-1 px-1 text-gray-600 border border-solid border-gray-600 rounded"
                />
                {error && error.toLowerCase().includes("password") &&
                  <div className="text-red-500">{error}</div>
                }
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-3 text-gray-500">
          {props.title === "Sign Up" ? (
            <Link href="/login">Have an account? Sign in</Link>
          ) : (
            <Link href="/signup">Don't have an account? Sign up</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
