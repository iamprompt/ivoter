import type { FormikConfig } from 'formik'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import type { FunctionComponent } from 'react'

import PlusOutlineIcon from '@iconify/icons-heroicons-outline/plus'
import TrashOutlineIcon from '@iconify/icons-heroicons-outline/trash'
import { Icon } from '@iconify/react'
import ChevronUpIcon from '@iconify/icons-heroicons-outline/chevron-up'
import ChevronDownIcon from '@iconify/icons-heroicons-outline/chevron-down'
import clsx from 'clsx'
import type { PollForm } from '../@types/form'

interface Props {
  type: 'create' | 'edit'
  config: FormikConfig<PollForm>
}

export const PollAdminFormModule: FunctionComponent<Props> = ({
  type,
  config,
}) => {
  const formik = useFormik<PollForm>(config)

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-5 grid grid-cols-2 gap-3 gap-y-5">
          <div className="col-span-2 inline-flex items-center gap-5">
            <label
              htmlFor="title"
              className="w-28 flex-shrink-0 text-lg font-bold"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="txtInput w-full"
              placeholder="Poll Title"
            />
          </div>
          <div className="col-span-2 inline-flex items-center gap-5">
            <label
              htmlFor="question"
              className="w-28 flex-shrink-0 text-lg font-bold"
            >
              Question
            </label>
            <input
              type="text"
              name="question"
              id="question"
              value={formik.values.question}
              onChange={formik.handleChange}
              className="txtInput w-full"
              placeholder="Ask your question??"
            />
          </div>
          <div className="col-span-2 inline-flex items-start gap-5">
            <label
              htmlFor="question"
              className="w-28 flex-shrink-0 text-lg font-bold"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="txtInput w-full resize-none"
              placeholder="Describe your question??"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="start_date" className="text-lg font-bold">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="start_date"
              id="start_date"
              onChange={formik.handleChange}
              value={formik.values.start_date}
              className="txtInput w-full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="endTime" className="text-lg font-bold">
              End Date
            </label>
            <input
              type="datetime-local"
              name="end_date"
              id="end_date"
              onChange={formik.handleChange}
              value={formik.values.end_date}
              className="txtInput w-full"
            />
          </div>
          <div className="col-span-2 gap-5">
            <label htmlFor="question" className="text-lg font-bold">
              Options
            </label>
            <FieldArray name="options">
              {({ push, remove, swap }) => (
                <>
                  <div className="mt-5 space-y-4">
                    {formik.values.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-5">
                        <span className="w-4 text-right">{index + 1}</span>
                        <input
                          value={option.name}
                          name={`options.${index}.name`}
                          onChange={formik.handleChange}
                          placeholder={`Option ${index + 1}`}
                          className="txtInput w-1/2"
                        />

                        <span className="flex flex-row items-center gap-3">
                          <Icon
                            icon={TrashOutlineIcon}
                            onClick={() =>
                              formik.values.options.length > 2 && remove(index)
                            }
                            className={clsx(
                              formik.values.options.length > 2
                                ? 'cursor-pointer text-gray-600 hover:text-red-600'
                                : 'cursor-not-allowed text-gray-300'
                            )}
                          />
                          <Icon
                            icon={ChevronUpIcon}
                            onClick={() =>
                              index !== 0 && swap(index, index - 1)
                            }
                            className={clsx(
                              index !== 0
                                ? 'cursor-pointer text-gray-600 hover:text-green-600'
                                : 'cursor-not-allowed text-gray-300'
                            )}
                          />

                          <Icon
                            icon={ChevronDownIcon}
                            onClick={() =>
                              index !== formik.values.options.length - 1 &&
                              swap(index, index + 1)
                            }
                            className={clsx(
                              index !== formik.values.options.length - 1
                                ? 'cursor-pointer text-gray-600 hover:text-green-600'
                                : 'cursor-not-allowed text-gray-300'
                            )}
                          />
                        </span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ name: '' })}
                      className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
                    >
                      <Icon icon={PlusOutlineIcon} inline className="inline" />
                      Add Options
                    </button>
                  </div>
                </>
              )}
            </FieldArray>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-x-5">
          {type === 'create' && (
            <>
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="items-center rounded-full bg-red-500 py-2 px-4 text-white"
              >
                Clear
              </button>
              <button
                type="submit"
                className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
              >
                Create Event
              </button>
            </>
          )}

          {type === 'edit' && (
            <>
              <button
                type="submit"
                className="items-center rounded-full bg-green-500 py-2 px-4 text-white"
              >
                Save
              </button>
            </>
          )}
        </div>
      </form>
    </FormikProvider>
  )
}
