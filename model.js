const moment = require('moment');
module.exports = {
  doLogin(db, username, password) {
    return db('users')
      .select('username', 'fullname', 'id')
      .where('username', username)
      .where('password', password)
      .limit(1);
  },

  postOday(db, tablename,vn,hn,fname,lname,male,age,pttype,vsttime){
   var sql = `
   insert into ??(vn,hn,fname,lname,male,age,pttype,vsttime,bw,tt,pr,rr,sbp,dbp,nrs,dtr,dtt,lab,xry,er,ors,rec,phm,hpt,phy,drxtime,fudate,fus1,fus2,fus3,fus4,fus5,ldrug) 
   values(?,?,?,?,?,?,?,?,'0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0000-00-00','0','0','0','0','0','0')
   `;
   return db.raw(sql, [tablename,vn,hn,fname,lname,male,age,pttype,vsttime]);
  },

  getPersonOvstHn(db, hn,vstdttm) {
    var sql = `
    select (CASE pt.male WHEN 1 THEN IF( pt.mrtlst < 6, IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ช.', 'นาย' ),
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 20, 'พระครูสังฆภารวิชัย', 'พระ' )
    ) WHEN 2 THEN IF( pt.mrtlst = 1,
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ญ.', 'น.ส.' ),
    IF( pt.mrtlst < 6, 'นาง', 'แม่ชี' )) END) AS prename,pt.hn,pt.pop_id,pt.fname,pt.lname,pttype.namepttype,pt.pttype,pt.male,round(DATEDIFF (curdate(), pt.brthdate) / 365.25) AS age,
		date(pt.brthdate) as brthdate,ovst.vstdttm,ovst.vn
    from pt 
    inner join pttype on pttype.pttype=pt.pttype 
    INNER JOIN ovst on ovst.hn = pt.hn
    where ovst.hn=?
    and date(ovst.vstdttm) = ?
    and ovstost='0'
    order by ovst.vn desc
    `;
    return db.raw(sql, [hn,vstdttm]);
  },

  getPersonOvstCid(db, cid,vstdttm) {
    var sql = `
    select (CASE pt.male WHEN 1 THEN IF( pt.mrtlst < 6, IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ช.', 'นาย' ),
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 20, 'พระครูสังฆภารวิชัย', 'พระ' )
    ) WHEN 2 THEN IF( pt.mrtlst = 1,
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ญ.', 'น.ส.' ),
    IF( pt.mrtlst < 6, 'นาง', 'แม่ชี' )) END) AS prename,pt.hn,pt.pop_id,pt.fname,pt.lname,pttype.namepttype,pt.pttype,pt.male,round(DATEDIFF (curdate(), pt.brthdate) / 365.25) AS age,
		date(pt.brthdate) as brthdate,ovst.vstdttm,ovst.vn
    from pt 
    inner join pttype on pttype.pttype=pt.pttype 
    INNER JOIN ovst on ovst.hn = pt.hn
    where pt.pop_id=?
    and date(ovst.vstdttm) = ?
    and ovstost='0'
    order by ovst.vn desc
    `;
    return db.raw(sql, [cid,vstdttm]);
  },

  getPersonAll(db, cid) {
    var sql = `
    select (CASE pt.male WHEN 1 THEN IF( pt.mrtlst < 6, IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ช.', 'นาย' ),
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 20, 'พระครูสังฆภารวิชัย', 'พระ' )
    ) WHEN 2 THEN IF( pt.mrtlst = 1,
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ญ.', 'น.ส.' ),
    IF( pt.mrtlst < 6, 'นาง', 'แม่ชี' )) END) AS prename,pt.hn,pt.pop_id,pt.fname,pt.lname,pttype.namepttype,pt.pttype,pt.male,round(DATEDIFF (curdate(), pt.brthdate) / 365.25) AS age,pt.brthdate from pt 
    inner join pttype on pttype.pttype=pt.pttype where pt.pop_id=? 
    `;
    return db.raw(sql, [cid]);
  },

  getPersonHiHn(db, hn) {
    var sql = `
    select (CASE pt.male WHEN 1 THEN IF( pt.mrtlst < 6, IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ช.', 'นาย' ),
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 20, 'พระครูสังฆภารวิชัย', 'พระ' )
    ) WHEN 2 THEN IF( pt.mrtlst = 1,
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ญ.', 'น.ส.' ),
    IF( pt.mrtlst < 6, 'นาง', 'แม่ชี' )) END) AS prename,pt.hn,pt.pop_id,pt.fname,pt.lname,pttype.namepttype,pt.pttype,pt.male,round(DATEDIFF (curdate(), pt.brthdate) / 365.25) AS age,pt.brthdate from pt 
    inner join pttype on pttype.pttype=pt.pttype where pt.hn=? and pt.dthdate = '0000-00-00'
    `;
    return db.raw(sql, [hn]);
  },

  getPersonHiCid(db, cid) {
    var sql = `
    select (CASE pt.male WHEN 1 THEN IF( pt.mrtlst < 6, IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ช.', 'นาย' ),
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 20, 'พระครูสังฆภารวิชัย', 'พระ' )
    ) WHEN 2 THEN IF( pt.mrtlst = 1,
    IF( DATE_FORMAT( NOW( ) , '%Y' ) - DATE_FORMAT( pt.brthdate, '%Y' ) - ( DATE_FORMAT( NOW( ) , '00-%m-%d' ) < DATE_FORMAT( pt.brthdate, '00-%m-%d' ) ) < 15, 'ด.ญ.', 'น.ส.' ),
    IF( pt.mrtlst < 6, 'นาง', 'แม่ชี' )) END) AS prename,pt.hn,pt.pop_id,pt.fname,pt.lname,pttype.namepttype,pt.pttype,pt.male,round(DATEDIFF (curdate(), pt.brthdate) / 365.25) AS age,pt.brthdate from pt 
    inner join pttype on pttype.pttype=pt.pttype where pt.pop_id=? and pt.dthdate = '0000-00-00'
    `;
    return db.raw(sql, [cid]);
  },

  getFu(db,hn,hn1,hn2){
    var sql = `
    SELECt 'clinic' as code,a.hn,a.cln,a.fudate,c.dspname,a.dct
                            from oapp a
                            LEFT OUTER JOIN cln c on (case WHEN LENGTH(a.cln) = 5 then c.cln=a.cln WHEN a.cln=1 then c.cln = 10100 WHEN a.cln=6 then c.cln = 60100 WHEN a.cln=7 then c.cln = 70100 END)
                            where a.fudate = curdate() and a.hn=? and c.dspname is not null and a.fuok=0
                            UNION
                            SELECt 'lab' as code,a.hn,a.cln,a.fudate,l.labname,a.dct
                            from oapp a
                            LEFT OUTER JOIN lab l on (case WHEN LENGTH(a.cln) = 4 then l.labcode=SUBSTR(a.cln,2,4) END)
                            where a.fudate = curdate() and a.hn=? and l.labname is not null and a.fuok=0
                            UNION
                            SELECt 'xray' as code,a.hn,a.cln,a.fudate,x.xryname,a.dct
                            from oapp a
                            LEFT OUTER JOIN xray x on (case WHEN SUBSTR(a.cln,1,1)=8 then x.xrycode=SUBSTR(a.cln,2,5) END)
                            where a.fudate = curdate() and a.hn=? AND x.xryname is not NULL and a.fuok=0
    `;    
    return db.raw(sql, [hn,hn1,hn2]);
  },

  postOvst(db, vstdttm,hn,cln,pttype,register){
    var sql = `
    insert into ovst(vstdttm,hn,cln,pttype,register,ovstost,ovstist,nrxtime,drxtime,overtime,bw,height,bmi,tt,pr,rr,sbp,dbp,preg,tb,toq,drink,mr,smoke,an,rcptno,waist_cm) 
    values(?,?,?,?,?,'0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0')
    `;
    return db.raw(sql, [vstdttm,hn,cln,pttype,register]);
  },

  postLbbk(db, labcode,vn,reportby,requestby,vstdttm,c2automate,hn,an,senddate,sendtime,srvtime,pttype,hcode,approve,lcomment,labcomment,labgroup,pdffile,acceptby,accepttime){
    var sql = `
    insert into lbbk(labcode,vn,reportby,requestby,vstdttm,c2automate,hn,an,senddate,sendtime,srvtime,pttype,hcode,approve,lcomment,labcomment,labgroup,pdffile,acceptby,accepttime)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    return db.raw(sql, [labcode,vn,reportby,requestby,vstdttm,c2automate,hn,an,senddate,sendtime,srvtime,pttype,hcode,approve,lcomment,labcomment,labgroup,pdffile,acceptby,accepttime]);
  },

  postUpdateVitalSign(db, bw,height,tt,sbp,dbp,pr,bmi,vn){
    var sql = `
    update ovst set ovst.bw = ?,ovst.height = ?,ovst.tt = ?,ovst.sbp = ?,ovst.dbp = ?,ovst.pr = ?,ovst.bmi = ?
    where ovst.vn = ?
    `;
    return db.raw(sql, [bw,height,tt,sbp,dbp,pr,bmi,vn]);
  },

  postUpdateVitalSignOday(db, tablename, bw,tt,sbp,dbp,pr,vn){
    var sql = `
    update ?? set bw = ?,tt = ?,sbp = ?,dbp = ?,pr = ?
    where vn = ?
    `;
    return db.raw(sql, [tablename, bw,tt,sbp,dbp,pr,vn]);
  },

  postUPdateLdate(db,ldate,hn){
    var sql = `
    update pt set ldate = ?
    where hn = ?
    `;
    return db.raw(sql, [ldate,hn]);
  },

  postUpdateOvstPttype(db,pttype,vn){
    var sql = `
    update ovst set ovst.pttype = ?
    where ovst.vn = ?
    `;
    return db.raw(sql, [pttype,vn]);
  },

  postAddSat(db,vn,sat){
    var sql = `
    insert into tempSat(vn,sat) values(?,?)
    `;
    return db.raw(sql, [vn,sat]);
  },

};


