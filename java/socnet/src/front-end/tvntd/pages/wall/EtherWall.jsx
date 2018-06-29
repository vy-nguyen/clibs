/**
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import { SectionWall }   from 'vntd-shared/layout/UserBase.jsx';
import { EtherBaseAcct } from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherPane         from 'vntd-root/pages/wall/EtherPane.jsx';

class EtherWall extends EtherBaseAcct
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SectionWall title="Tudo Vietnam Network" className="panel-success">
                <EtherPane/>
            </SectionWall>
        );
    }
}

export default EtherWall;
