package com.njfu.ia.sys.shiro;

import com.njfu.ia.sys.domain.User;
import com.njfu.ia.sys.service.SecurityService;
import com.njfu.ia.sys.utils.Constants;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;

/**
 * 自定义Realm，用于认证和授权
 */
public class AuthRealm extends AuthorizingRealm {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthRealm.class);
    @Resource
    private SecurityService securityService;

    /**
     * 认证
     *
     * @param token token
     * @return AuthenticationInfo
     * @throws AuthenticationException AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        String username = upToken.getUsername();
        User user = securityService.queryUser(username);

        if (null == user) {
            throw new UnknownAccountException("不存在该账户！");
        }

        String name = user.getName();
        String password = user.getPassword();
        String salt = user.getSalt();
        Integer status = user.getStatus();

        if (null == name || null == password || null == salt) {
            throw new AccountException("账户异常！");
        }
        if (Constants.VALID_USER_STATUS != status) {
            // 账号无效
            throw new AccountException("无效账号！");
        }

        // 身份信息，密码（数据库中加密后的密码），salt，realmName
        return new SimpleAuthenticationInfo(user, password, ByteSource.Util.bytes(salt), this.getName());
    }

    /**
     * 授权
     *
     * @param principals principals
     * @return AuthorizationInfo
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        Set<String> permissions = new HashSet<>();
        try {
            // 获取身份信息
            User user = (User) principals.getPrimaryPrincipal();
            // 查询权限信息
            permissions.addAll(securityService.queryStringPermissions(user.getId()));
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        info.addStringPermissions(permissions);
        return info;
    }

    /**
     * 用户权限发生变动，调用此方法清除缓存
     */
    public void clearCache() {
        PrincipalCollection principals = SecurityUtils.getSubject().getPrincipals();
        super.clearCache(principals);
        LOGGER.info("ehcache clear");
    }
}