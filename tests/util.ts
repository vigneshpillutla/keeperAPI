import _ from 'lodash';

class TestUser {
  #User = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@gmail.com',
    password: 'TestUser$1234'
  };

  getSignUpData() {
    return this.#User;
  }

  getLoginData(valid?: 'email' | 'password' | 'both') {
    const loginData = _.pick(this.#User, ['email', 'password']);
    const data = {
      email: {
        ...loginData,
        password: 'invalidPassword'
      },
      password: {
        ...loginData,
        email: 'invalidEmail@test.com'
      },
      both: loginData
    };
    if (!valid || valid === 'both') {
      return data['both'];
    }
    return data[valid];
  }

  getUserData() {
    return _.pick(this.#User, ['firstName', 'lastName', 'email']);
  }
}

class TestNotes {
  #Notes: Array<{
    title: string;
    content: string;
  }>;

  /**
   *
   * @param notes Number of dummy notes to be created, defaults to 5.
   */
  constructor(notes = 5) {
    this.#Notes = Array.from({ length: notes }, (value, index) => ({
      // id: index,
      title: `Note ${index}`,
      content: `Auto generated content for note ${index}`
    }));
  }

  getNotes() {
    return this.#Notes;
  }

  getNote(index: number) {
    return this.#Notes[index];
  }
}

export { TestUser, TestNotes };
