import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import FilterEffect from "../FilterEffects/FilterEffect";
Enzyme.configure({ adapter: new Adapter() });

describe("FilterEffect component", () => {
  it("renders without crashing", () => {
    shallow(<FilterEffect />);
  });

  it("renders select element", () => {
    const wrapper = shallow(<FilterEffect />);
    expect(wrapper.find("select")).toHaveLength(1);
  });

  it("changes filterClass state when select value changes", () => {
    const setFilterClass = jest.fn();
    jest
      .spyOn(React, "useContext")
      .mockImplementation(() => ({ filterClass: "", setFilterClass }));
    const wrapper = shallow(<FilterEffect />);
    const select = wrapper.find("Select");
    select.simulate("change", { target: { value: "filter-1977" } });
    expect(setFilterClass).toHaveBeenCalledWith("filter-1977");
  });
});
