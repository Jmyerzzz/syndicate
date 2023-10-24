'use client'

import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useRouter } from "next/navigation";
import { formValues } from '@/types/types';

const UserForm = (props: {title: string, action: string, setRefreshKey?: any}) => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: formValues = {
    name: '',
    risk: 0,
    username: '',
    password: '',
    gabeWay: 0
  };

  const handleSubmit = async (values: any, actions: any) => {
    let name, risk, gabeWay, username, password, formData;
    if (props.title === "Sign Up") {
      ({name, risk, gabeWay, username, password} = values);
      formData = {name, risk, gabeWay, username, password};
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
        if (props.title === "Sign Up") {
          setTimeout(() => {
            props.setRefreshKey((oldKey: number) => oldKey +1)
          }, 1000)
        } else {
          return router.refresh();
        }
      }
  
      actions.setSubmitting(false);
    })
  }

  return (
    <div className={`flex flex-grow items-center justify-center bg-[17,23,41] ${props.title === "Log In" && "h-screen"}`}>
      <div className="bg-white p-8 rounded w-80">
        <h2 className="text-2xl text-gray-600 font-bold mb-4">{props.title}</h2>
        <Formik initialValues={initialValues} onSubmit={(values, actions) => handleSubmit(values, actions)}>
          {({ isSubmitting }) => (
            <Form>
              {props.title === "Sign Up" &&
                <>
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
                  <div className="mb-4 text-gray-500">
                    <label htmlFor="risk" className="block font-medium">
                      Risk %
                    </label>
                    <Field
                      type="number"
                      id="risk"
                      name="risk"
                      className="form-input w-full mt-1 px-1 text-gray-600 border border-solid border-gray-600 rounded"
                    />
                    {error && error.toLowerCase().includes("risk") &&
                      <div className="text-red-500">{error}</div>
                    }
                  </div>
                  <div className="mb-4 text-gray-500">
                    <label htmlFor="gabeWay" className="block font-medium">
                      G Way %
                    </label>
                    <Field
                      type="number"
                      id="gabeWay"
                      name="gabeWay"
                      className="form-input w-full mt-1 px-1 text-gray-600 border border-solid border-gray-600 rounded"
                    />
                    {error && error.toLowerCase().includes("risk") &&
                      <div className="text-red-500">{error}</div>
                    }
                  </div>
                </>
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
      </div>
    </div>
  );
};

export default UserForm;
