import { endpoints } from "@/config/endpoints";
import { FilterOptions } from "@/config/types";
import { api } from "@/lib/api-client";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Select } from "../ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const TaxonomySelects = () => {
  const form = useFormContext();
  const defaultMake = form.getValues("make") || null;
  const defaultModel = form.getValues("model") || null;

  const [make, setMake] = useState<string | null>(defaultMake);
  const [makes, setMakes] = useState<FilterOptions<string, string>>([]);

  const [model, setModel] = useState<string | null>(defaultModel);
  const [models, setModels] = useState<FilterOptions<string, string>>([]);

  const [modelVariants, setModelVariants] = useState<
    FilterOptions<string, string>
  >([]);

  useEffect(() => {
    (async function fetchTaxonomy() {
      const url = new URL(endpoints.taxonomy, window.location.href);

      if (make) url.searchParams.append("make", make);
      if (model) url.searchParams.append("model", model);

      const data = await api.get<{
        makes: FilterOptions<string, string>;
        models: FilterOptions<string, string>;
        modelVariants: FilterOptions<string, string>;
      }>(url.toString());

      setMakes(data.makes);
      setModels(data.models);
      setModelVariants(data.modelVariants);
    })();
  }, [make, model]);

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "make":
        setMake(value);
        break;
      case "model":
        setModel(value);
        break;
    }
    return onChange(e);
  };
  return (
    <>
      <FormField
        control={form.control}
        name="make"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { onChange, ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="make">Make</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={makes}
                onChange={(e) => handleChange(e, onChange)}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="model"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { onChange, ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="model">Model</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={models}
                onChange={(e) => handleChange(e, onChange)}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />{" "}
      <FormField
        control={form.control}
        name="modelVariant"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { onChange, ref, ...rest } }) => (
          <FormItem>
            <FormLabel htmlFor="modelVariant">Model Variant</FormLabel>
            <FormControl>
              <Select
                selectClassName="text-gray-300 !bg-primary-800 border-transparent"
                options={modelVariants}
                onChange={(e) => handleChange(e, onChange)}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
