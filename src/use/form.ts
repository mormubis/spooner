import { useContext } from 'react';

import type { FormContext } from '../Context';
import Context from '../Context';

export default (): FormContext => useContext(Context);
