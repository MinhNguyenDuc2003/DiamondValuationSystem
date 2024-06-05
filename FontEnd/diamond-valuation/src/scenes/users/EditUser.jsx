import React, { useEffect } from "react";
import { useState } from "react";
import {
  getRoles,
  getUserById,
  saveUser,
} from "../../components/utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";

export const EditUser = () => {
  const { userid } = useParams();
  const [user, setUser] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "",
    enabled: false,
    photo: null,
    role_ids: [],
  });

  const [roles, setRoles] = useState([]);

  const [imagePreview, setImagePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        setRoles(roles);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const useredit = await getUserById(userid);
        setUser({
          id: useredit.id,
          email: useredit.email,
          first_name: useredit.first_name,
          last_name: useredit.last_name,
          password: "",
          phone_number: useredit.phone_number,
          enabled: useredit.enabled,
          photo: useredit.photo,
          role_ids: useredit.role_ids,
        });
        setImagePreview(useredit.photo);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const handleEnabledChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setUser({ ...user, [name]: true });
    } else {
      setUser({ ...user, [name]: false });
    }
  };

  const handleCheckboxChange = (event) => {
    let roles = user.role_ids;
    const { name, checked, value } = event.target;
    if (checked) {
      roles.push(value);
      setUser({ ...user, [name]: roles });
    } else {
      setUser({ ...user, [name]: roles.filter((roleId) => roleId !== value) });
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setUser({ ...user, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const navigate = useNavigate();
  const redirectUrl = "/users";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await saveUser(user);
      if (result.message !== undefined) {
        navigate(redirectUrl, {
          state: { message: "Add/Update new User successfully" },
        });
      } else {
        setErrorMessage("Your email is invalid");
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };
  const handleClickCancel = () => {
    navigate("/users");
  };

  return (
    <div className="container-fluid">
      <div>
        <h2 className="text-center">Manage Users</h2>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e)}
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="border border-secondary rounded p-3">
          <div>
            {errorMessage && (
              <p className="text-center" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
          </div>
          <div className="form-group row mt-3">
            <label htmlFor="email" className="col-sm-4 col-form-label">
              E-mail:
            </label>
            <div className="col-sm-8">
              <input
                value={user.email}
                onChange={(e) => handleInputChange(e)}
                type="email"
                id="email"
                name="email"
                className="form-control"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="form-group row mt-3">
            <label htmlFor="first_name" className="col-sm-4 col-form-label">
              First Name:
            </label>
            <div className="col-sm-8">
              <input
                value={user.first_name}
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                onChange={(e) => handleInputChange(e)}
                required
                minLength={2}
                maxLength={45}
              />
            </div>
          </div>

          <div className="form-group row mt-3">
            <label htmlFor="last_name" className="col-sm-4 col-form-label">
              Last Name:
            </label>
            <div className="col-sm-8">
              <input
                value={user.last_name}
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                onChange={(e) => handleInputChange(e)}
                required
                minLength={2}
                maxLength={45}
              />
            </div>
          </div>

          <div className="form-group row mt-3">
            <label htmlFor="password" className="col-sm-4 col-form-label">
              Password:
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                placeholder="If you don't want change your password leave it blank. "
                className="form-control"
                id="password"
                name="password"
                onChange={(e) => handleInputChange(e)}
                minLenght={5}
                maxLength={20}
              />
            </div>
          </div>

          <div className="form-group row mt-3">
            <label htmlFor="phone_number" className="col-sm-4 col-form-label">
              Phone Number:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                value={user.phone_number}
                className="form-control"
                required
                id="phone_number"
                name="phone_number"
                onChange={(e) => handleInputChange(e)}
                minLenght={10}
                maxLength={10}
              />
            </div>
          </div>

          <div className="form-group row mt-3">
            <label className="col-sm-4 col-form-label">Enabled:</label>
            <div className="col-sm-8 mt-2">
              <input
                onChange={(e) => handleEnabledChange(e)}
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={user.enabled}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Roles:</label>
            <div className="col-sm-8">
              {roles &&
                roles.map((role) => (
                  <div key={role.id}>
                    <input
                      onChange={(e) => handleCheckboxChange(e)}
                      type="checkbox"
                      id={role.id}
                      value={role.id}
                      name="role_ids"
                      className="m-2"
                      checked={user.role_ids.includes(role.id + "")}
                    />
                    <small>{role.name} </small> -{" "}
                    <small>{role.description}</small>
                    <br />
                  </div>
                ))}
            </div>
          </div>

          <div className="form-group row mt-2">
            <label className="col-sm-4 col-form-label">Photos:</label>
            <div className="col-sm-8">
              <input
                type="file"
                onChange={(e) => handleImageChange(e)}
                id="fileImage"
                name="photo"
                accept="image/png, image/jpeg"
                className="mb-2 mt-2"
              />
              <br />
              {imagePreview && (
                <img
                  src={imagePreview}
                  id="thumbnail"
                  alt="Photos preview"
                  className="img-fluid mt-3"
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                />
              )}
            </div>
          </div>

          <div className="text-center">
            <input type="submit" value="Save" className="btn btn-primary m-3" />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              id="buttonCancel"
              onClick={() => handleClickCancel()}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
